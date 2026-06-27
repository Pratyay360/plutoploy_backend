export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  KV_NAMESPACE: KVNamespace;
}

export interface DeploymentConfig {
  deployId: string;
  subdomain: string;
  port: number;
  imageName: string;
  containerPort?: number;
}

export interface Repo {
  id: string;
  projectName: string;
  description: string;
  commitHash: string;
  branch: string;
  status: string;
  duration: string;
  timestamp: string;
  full_name: string;
  html_url: string;
}

export interface Deployment {
  id: string;
  projectName: string;
  commitHash: string;
  branch: string;
  status: "success" | "building" | "failed";
  duration: string;
  timestamp: string;
  repoFullName: string;
  runtime?: string;
  image?: string;
  subdomain?: string;
}
