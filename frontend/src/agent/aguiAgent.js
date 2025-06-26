// AG-UI Protocol minimal agent client (mock for now)
// See: https://docs.ag-ui.com/introduction

export class AGUIAgent {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async sendMessage(message) {
    // In a real implementation, this would POST to the AG-UI agent endpoint
    // For now, return a canned response in AG-UI format
    return {
      role: 'assistant',
      content: `AG-UI Agent received: "${message}"\n(This is a mock response. Connect to a real agent for live insights.)`,
      protocol: 'ag-ui/1.0',
      timestamp: new Date().toISOString()
    };
  }
}
