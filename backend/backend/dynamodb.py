from aws_cdk import (
    RemovalPolicy,
    aws_dynamodb as dynamodb,
    aws_applicationautoscaling as autoscaling,
)

def create_tables(scope):
    # Dogs table
    dogs_table = dynamodb.Table(
        scope, "DogsTable",
        table_name="pupper-dogs",
        partition_key=dynamodb.Attribute(
            name="id",
            type=dynamodb.AttributeType.STRING
        ),
        billing_mode=dynamodb.BillingMode.PROVISIONED, # Change to PROVISIONED for auto-scaling
        read_capacity=5,
        write_capacity=5,
        removal_policy=RemovalPolicy.DESTROY,
    )

    # Add auto-scaling to the dogs table
    read_scaling = dogs_table.auto_scale_read_capacity(
        min_capacity=5,
        max_capacity=100
    )

    read_scaling.scale_on_utilization(
        target_utilization_percent=70
    )

    write_scaling = dogs_table.auto_scale_write_capacity(
        min_capacity=5,
        max_capacity=50
    )

    write_scaling.scale_on_utilization(
        target_utilization_percent=70
    )

    # User interactions table
    interactions_table = dynamodb.Table(
        scope, "UserInteractionsTable",
        table_name="pupper-interactions",
        partition_key=dynamodb.Attribute(
            name="userId",
            type=dynamodb.AttributeType.STRING
        ),
        sort_key=dynamodb.Attribute(
            name="dogId",
            type=dynamodb.AttributeType.STRING
        ),
        billing_mode=dynamodb.BillingMode.PROVISIONED, # Change to PROVISIONED for auto-scaling
        read_capacity=5,
        write_capacity=5,
        removal_policy=RemovalPolicy.DESTROY,
    )

    # Add auto-scaling to the interactions table
    read_scaling = interactions_table.auto_scale_read_capacity(
        min_capacity=5,
        max_capacity=100
    )

    read_scaling.scale_on_utilization(
        target_utilization_percent=70
    )

    write_scaling = interactions_table.auto_scale_write_capacity(
        min_capacity=5,
        max_capacity=50
    )

    write_scaling.scale_on_utilization(
        target_utilization_percent=70
    )
    
    return dogs_table, interactions_table
