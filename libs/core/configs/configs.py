import os

class DatabaseConfig:
    host: str
    port: int
    user: str
    password: str
    name: str

    def __init__(self, host: str, port: int, user: str, password: str, name: str):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.name = name

class DatabaseConfigCollection:
    base: DatabaseConfig

    def __init__(self):
        self.base = DatabaseConfig(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", 5432),
            user=os.getenv("DB_USER", "nexi"),
            password=os.getenv("DB_PASSWORD", "11111111"),
            name=os.getenv("DB_NAME", "agent_credit_system")
        )

class SystemConfig:

    def __init__(self):
        pass

class Config:
    environment: str
    db: DatabaseConfigCollection
    system: SystemConfig

def init_config() -> Config:
    config = Config()
    config.environment = os.getenv("ENVIRONMENT", "development")
    config.db = DatabaseConfigCollection()
    config.system = SystemConfig()
    return config

config = init_config()