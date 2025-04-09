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

class OpenAIConfig:
    api_key: str
    base_url: str
    model_name: str

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        self.model_name = os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini")

class Config:
    environment: str
    db: DatabaseConfigCollection
    system: SystemConfig
    openai: OpenAIConfig

def init_config() -> Config:
    config = Config()
    config.environment = os.getenv("ENVIRONMENT", "development")
    config.db = DatabaseConfigCollection()
    config.system = SystemConfig()
    config.openai = OpenAIConfig()
    return config

config = init_config()