docker buildx build --platform linux/amd64 -t gcr.io/flowise-staging/acrm:latest --push -f .infra/docker/Dockerfile.acrm .

gcloud run deploy acrm \
    --image gcr.io/flowise-staging/acrm:latest \
    --platform managed \
    --region asia-southeast1 \
    --project flowise-staging \
    --allow-unauthenticated
