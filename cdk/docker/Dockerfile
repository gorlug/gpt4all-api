FROM public.ecr.aws/lambda/nodejs:20

# Copy function code
COPY node_modules ${LAMBDA_TASK_ROOT}/node_modules
CMD mkdir /opt/models
COPY models/mistral-7b-openorca.gguf2.Q4_0.gguf /opt/models/
COPY models/models3.json /opt/models/
COPY index.js ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
