import json
import requests
from urllib.parse import urljoin
import pandas as pd


class StatsHandler:
    def __init__(self):
        self.__base_api_url = 'https://api.sportsdata.io/v3/nfl/stats/json/'
        with open('api_key.txt', 'r') as file:
            self.__api_key = file.readline()
        self.__headers = {'Ocp-Apim-Subscription-Key' : self.__api_key}
        self.__player_game_stats_path = 'PlayerGameStatsByWeek'
        
    def get_player_stats_by_week(self, season: int, week: int, fields: list=None, players: list=None, output_path: str=None):
        try:
            endpoint = urljoin(self.__base_api_url, f'{self.__player_game_stats_path}/{season}/{week}')
            response = requests.get(endpoint, headers=self.__headers)
            data = json.loads(response.content.decode())
            
            df = pd.json_normalize(data)
            if players:
                if all(isinstance(player, int) for player in players):
                    df = df[df["PlayerID"].isin(players)]
                elif all(isinstance(player, str) for player in players):
                    df = df[df["ShortName"].isin(players)]
                else:
                    raise TypeError("All elements of players arg must be of type int or str. Choose one or the other :)")
            if fields:
                df = df[fields]
            data = df.to_dict(orient='records')

            if output_path:
                with open(output_path, 'w') as file:
                    file.write(json.dumps(data, indent=4))
            return data

        except Exception as error:
            raise error
    
    def get_players(self, season: int, week: int, fields: list=None, players: list=None, output_path: str=None):
        if fields is None:
            fields = ['PlayerID', 'ShortName', 'Position']
        players = self.get_player_stats_by_week(season=season, week=week, fields=fields,
                                                players=players, output_path=output_path)
        return players

        
    def get_player_stats_by_season(self, season: int, fields: list=None, players: list=None, output_path: str=None):
        try:
            df = None
            for week_num in range(1, 19):
                print(f"week: {week_num}")
                data = self.get_player_stats_by_week(season=season, week=week_num, fields=fields, players=players)

                if df is None:
                    df = pd.DataFrame.from_dict(data)
                else:
                    df = pd.concat([df, pd.DataFrame.from_dict(data)])
            
            df = df.sort_values(by=['PlayerID', 'GameKey'])
            data = df.to_dict(orient='records')
            
            if output_path:
                with open(output_path, 'w') as file:
                    file.write(json.dumps(data, indent=4))
            return data

        except Exception as error:
            raise error



if __name__ == "__main__":
    handler = StatsHandler()
    # stats = handler.get_player_stats_by_week(season=2022, week=1, fields=[
    #         'GameKey', 'PlayerID', 'FantasyPointsPPR'], output_path='../data/PlayerStatsByWeek.json')
    players = handler.get_players(season=2022, week=1, fields=['PlayerID', 'ShortName', 'Position', 'Team'],
                                    output_path='../data/Players.json')
    # season_stats = handler.get_player_stats_by_season(season=2021, fields=['GameKey', 'PlayerID', 'FantasyPointsPPR'],
    #                                                     players=["Aaron Rodgers", "Cooper Kupp"],
    #                                                     output_path='../data/2021_season_stats.json')
