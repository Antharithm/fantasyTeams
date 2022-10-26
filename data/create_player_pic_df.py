import requests
from bs4 import BeautifulSoup
import pandas as pd
import re


def getdata(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36'}):
    r = requests.get(url, headers=headers)
    return r.text


def text_strip(x):
    return x.text.strip()


def get_pic_url(row, img_base_url="https:\/\/static.www.nfl.com\/image\/private\/t_thumb_squared_2x\/t_lazy\/f_auto\/league\/(.*) 2x"):
    pic_url_list = re.findall(img_base_url, str(row))
    if len(pic_url_list) == 0:
        return 'NA'
    else:
        pic_url_list_refined = list(pic_url_list[0].split(','))
        pic_url = pic_url_list_refined[-1]
        pic_url_fixed = pic_url.replace('t_lazy/', '')
    return pic_url_fixed


def get_player_data(team_link, headers=None):
    htmldata = getdata(team_link, headers=headers)
    # get data
    soup = BeautifulSoup(htmldata, 'lxml')
    table_data = soup.find(
        'table', class_="d3-o-table d3-o-table--row-striping d3-o-table--detailed d3-o-table--sortable {sortlist: [[3,0]]}")

    # get column names
    col_names = []
    for i in table_data.find_all('th'):
        title = i.text.strip()
        col_names.append(title)

    # make df
    df = pd.DataFrame(columns=col_names)
    df.columns = df.columns.str.lower()

    # get row data
    for idx, j in enumerate(table_data.find_all('tr')):
        if idx == 0:
            pass
        else:
            row_data = j.find_all('td')
            length = len(df)
            df.loc[length] = row_data

    # get player name and url to picture
    df['player_name'] = df['player'].apply(text_strip)
    for i in df.columns[1:-1]:
        df[i] = df[i].apply(text_strip)

    df['player_url'] = df['player'].apply(get_pic_url)

    # rearrange
    df = df.drop(['player'], axis=1)
    df = df[['player_name', 'no', 'pos', 'status', 'height',
             'weight', 'experience', 'college', 'player_url']]
    return df
