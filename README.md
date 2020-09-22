# Full-Stack-ML
A Full-Stack-ML Experimental Project
## Demo http://ec2-18-221-79-86.us-east-2.compute.amazonaws.com/


## [model training workbook](https://github.com/whpskg/Full-Stack-ML/blob/master/model-training/model-training.ipynb)

## Docker configuration
```console
docker pull tensorflow-serving

```

```console
docker run -d -p 8501:8501 --mount type=bind,\
	source=PATH_TO_MODEL,\
	target=TARGET_MODEL \
	-e MODEL_NAME=YOUR_MODEL_NAME \
	-t tensorflow/serving
```

## Contributor

[Hanpeng Wang](https://github.com/whpskg)
