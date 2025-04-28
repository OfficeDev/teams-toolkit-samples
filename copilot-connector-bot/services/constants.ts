export enum TargetConnectorState {
    Enabled = "enabled",
    Disabled = "disabled",
}

export enum ConnectionState {
    Ready = "ready",
}

export const ExpectedMicrosoftApps = [
    "56c1da01-2129-48f7-9355-af6d59d42766", // Graph Connector Service
    "0bf30f3b-4a52-48df-9a82-234910c4a086", // Microsoft Graph Change Tracking
]