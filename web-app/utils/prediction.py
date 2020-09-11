import requests
import json
PREDCTION_END_POINT = "http://localhost:8501/v1/models/my_model:predict"
headers = {"content-type": "application/json"}


def make_pred(data):
    data = data / 255.0
    data = json.dumps({"instances": data.tolist()})
    res = requests.post(PREDCTION_END_POINT, data=data, headers=headers)
    result = json.loads(res.text)['predictions']
    result = list(map(lambda x: int(x[0]), result))

    return result
