import io
import cv2
import urllib.request
import numpy as np


def Face_extract(source, source_type, resize_dim=(150, 150)):
    if source_type == "url":
        img_bytes = urllib.request.urlopen(source)
    elif source_type == "file":
        img_bytes = io.BytesIO(source)
    else:
        raise "invalid source_type"
    img_arr = np.array(bytearray(img_bytes.read()), dtype=np.uint8)
    img_arr = cv2.imdecode(img_arr, 1)
    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_BGR2GRAY)
    original_img_size = img_gray.shape
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    bound_boxes = face_cascade.detectMultiScale(img_gray, 1.2, 7)
    faces = np.empty([len(bound_boxes), resize_dim[0], resize_dim[1], 3])
    for i in range(len(bound_boxes)):
        (x, y, w, h) = bound_boxes[i]
        resized_face = cv2.resize(
            img_arr[y:y+h, x:x+w], resize_dim, interpolation=cv2.INTER_AREA)
        faces[i] = resized_face
    return (original_img_size, bound_boxes, faces)
