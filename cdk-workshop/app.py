#!/usr/bin/env python3

import aws_cdk as cdk

from cdk_workshop.cdk_workshop_stack import pupperStack


app = cdk.App()
pupperStack(app, "pupperStack")

app.synth()
