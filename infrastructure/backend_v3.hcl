bucket         = "connery-terraform-remote-state-np"
key            = "google-sheets/v3/terraform.tfstate"
region         = "eu-central-1"
encrypt        = true
dynamodb_table = "connery-terraform-statelock"