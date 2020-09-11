import uvicorn

from fastapi import FastAPI, Request, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from pydantic import BaseModel
from typing import Optional

import json
from utils.face_extract import Face_extract
from utils.prediction import make_pred

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")


@app.post("/pred/fromUrl")
async def predict_from_url(request: Request):
    try:
        req = await request.body()
        req = json.loads(req)
        (original_img_size, bound_boxes, faces) = Face_extract(
            req["url_image"], "url")
        prediction = make_pred(faces)
    except Exception as err:
        err = str(err)
        return {"success": False, "err": err}

    return {"success": True, "prediction": prediction, "annotation_position": bound_boxes.tolist(), "original_img_size": original_img_size}


@app.post("/pred/fromFile")
def predict_from_file(request: Request, file: bytes = File(...)):
    try:
        (original_img_size, bound_boxes, faces) = Face_extract(file, "file")
        prediction = make_pred(faces)
    except Exception as err:
        err = str(err)
        return {"success": False, "err": err}
    return {"success": True, "prediction": prediction, "annotation_position": bound_boxes.tolist(), "original_img_size": original_img_size}


@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/test", response_class=HTMLResponse)
def test(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "number": 123421})
