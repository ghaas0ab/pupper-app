import aws_cdk as cdk
import pytest
from aws_cdk.assertions import Template, Match
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from cdk_workshop.cdk_workshop_stack import pupperStack

def test_dynamodb_tables_created():
    app = cdk.App()
    stack = pupperStack(app, "TestStack")
    template = Template.from_stack(stack)
    
    # Check that we have at least 2 DynamoDB tables
    template.resource_count_is("AWS::DynamoDB::Table", 2)
    
    # Check for tables with specific logical IDs instead of properties
    template.has_resource("AWS::DynamoDB::Table", {
        "Properties": Match.object_like({
            "KeySchema": Match.array_with([
                Match.object_like({
                    "AttributeName": "id"
                })
            ])
        })
    })
    
    template.has_resource("AWS::DynamoDB::Table", {
        "Properties": Match.object_like({
            "KeySchema": Match.array_with([
                Match.object_like({
                    "AttributeName": "userId"
                })
            ])
        })
    })

def test_lambda_function_created():
    app = cdk.App()
    stack = pupperStack(app, "TestStack")
    template = Template.from_stack(stack)
    
    # Updated to expect 2 Lambda functions
    template.resource_count_is("AWS::Lambda::Function", 2)
    
    # Check for Lambda with handler property
    template.has_resource("AWS::Lambda::Function", {
        "Properties": Match.object_like({
            "Handler": Match.string_like_regexp("lambda.handler")
        })
    })

def test_api_gateway_created():
    app = cdk.App()
    stack = pupperStack(app, "TestStack")
    template = Template.from_stack(stack)
    
    # Check that we have an API Gateway
    template.resource_count_is("AWS::ApiGateway::RestApi", 1)