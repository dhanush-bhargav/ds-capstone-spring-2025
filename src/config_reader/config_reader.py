import configparser

class ConfigData:
    def __init__(self, filepath):
        self.config = configparser.ConfigParser()
        self.config.read(filepath)

    def get_section(self, section):
        return self.config[section]

    def get_value(self, section, key):
        return self.config[section][key]