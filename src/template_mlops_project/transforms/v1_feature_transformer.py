from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler


def create_transformer() -> ColumnTransformer:
    return ColumnTransformer([("scaling", StandardScaler(), [""])])
