from aws_cdk import (
    aws_apigateway as apigateway,
    Duration,
)

def create_api(scope, lambda_fn, domain_name=None, certificate=None):
    # API Gateway with caching
    api = apigateway.RestApi(
        scope, "PupperApiClean",
        rest_api_name="Pupper Dogs API Clean",
        default_cors_preflight_options=apigateway.CorsOptions(
            allow_origins=["*"],
            allow_methods=["GET", "POST", "OPTIONS", "DELETE"],
            allow_headers=["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
        ),
        deploy_options=apigateway.StageOptions(
            stage_name="prod",
            cache_cluster_enabled=True,
            cache_cluster_size="0.5",
            cache_ttl=Duration.minutes(5),
            method_options={
                "/dogs/GET": apigateway.MethodDeploymentOptions(
                    cache_ttl=Duration.minutes(5)
                ), 
                "/dogs/{id}/GET": apigateway.MethodDeploymentOptions(
                    cache_ttl=Duration.minutes(5)
                )
            },
            tracing_enabled=True # Enable X-Ray tracing
        )
    )

    # Add custom domain if provided
    if domain_name and certificate:
        domain = apigateway.DomainName(
            scope, "ApiDomain",
            domain_name=domain_name,
            certificate=certificate,
            endpoint_type=apigateway.EndpointType.EDGE,
            security_policy=apigateway.SecurityPolicy.TLS_1_2
        )

        domain.add_base_path_mapping(
            api,
            stage="prod"
        )
    api.root.add_proxy(
        default_integration=apigateway.LambdaIntegration(lambda_fn),
        any_method=True
    )
    return api