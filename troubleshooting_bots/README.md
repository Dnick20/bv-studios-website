# BV Studios Hierarchical Troubleshooting Bot System

A comprehensive AI-powered troubleshooting system using **CrewAI + LangGraph** for automated problem detection and resolution in the BV Studios web platform.

## 🏗️ System Architecture

### **Hierarchical Structure**
- **1 Coordinator Bot**: `TroubleshootingCoordinator` - Main supervisor using CrewAI
- **6 Specialized Sub-Bots**: 3 diagnostic + 3 fix bots for targeted problem solving
- **LangGraph Workflow**: StateGraph orchestration for complex multi-step processes
- **Comprehensive Monitoring**: Structured logging, metrics, and health tracking

### **Core Components**

```
troubleshooting_bots/
├── __init__.py              # Package initialization
├── requirements.txt         # Python dependencies
├── config.py               # System configuration
├── models.py               # Pydantic data structures
├── utils.py                # Utilities and helpers
├── coordinator.py          # Main TroubleshootingCoordinator
├── diagnostic_bots.py      # 3 diagnostic specialists
├── fix_bots.py            # 3 fix specialists  
├── workflow.py            # LangGraph workflow orchestration
├── monitoring.py          # Logging, metrics, health monitoring
├── examples.py            # Usage examples and testing
└── README.md              # This documentation
```

## 🤖 Bot Specialists

### **Diagnostic Bots**
1. **BotWebDiagnostic**: Frontend, React, Next.js, UI issues
2. **BotDatabaseDiagnostic**: PostgreSQL, Prisma, connections, performance  
3. **BotNetworkDiagnostic**: API endpoints, authentication, network issues

### **Fix Bots**
1. **BotWebFix**: Resolves frontend and client-side problems
2. **BotDatabaseFix**: Handles database and data management issues
3. **BotNetworkFix**: Fixes API, network, and integration problems

## 🚀 Quick Start

### **1. Installation**

```bash
# Navigate to the project directory
cd troubleshooting_bots

# Install Python dependencies
python3 -m pip install -r requirements.txt
```

### **2. Configuration**

Create a `.env` file with required environment variables:

```env
# Required
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://user:pass@host:port/database

# Optional
AGENTOPS_API_KEY=your-agentops-key
BV_STUDIOS_BASE_URL=https://your-bv-studios-url.vercel.app
LOG_LEVEL=INFO
```

### **3. Basic Usage**

```python
import asyncio
from workflow import troubleshooting_workflow

async def main():
    # Run complete troubleshooting workflow
    result = await troubleshooting_workflow.run_troubleshooting(
        initial_issue="Users reporting slow page load times"
    )
    
    print(f"Success: {result['success']}")
    print(f"Health Score: {result['health_score']}%")
    print(f"Summary: {result['summary']}")

# Execute
asyncio.run(main())
```

### **4. Run Examples**

```bash
# Run all example scenarios
python3 examples.py
```

## 🔄 Workflow Process

The system follows a structured **7-phase workflow**:

1. **Initialization** - Setup session and state
2. **System Assessment** - Gather comprehensive system information  
3. **Diagnostic Phase** - Run 3 diagnostic bots in parallel
4. **Issue Prioritization** - Sort issues by severity and impact
5. **Resolution Phase** - Execute appropriate fix bots
6. **Verification** - Confirm fixes and re-assess system health
7. **Final Report** - Generate comprehensive results and recommendations

## 📊 Advanced Usage

### **Using Individual Components**

```python
# Use only the coordinator
from coordinator import troubleshooting_coordinator

session = await troubleshooting_coordinator.start_troubleshooting_session()
diagnostic_reports = await troubleshooting_coordinator.execute_diagnostic_phase()
```

```python
# Use diagnostic bots directly
from diagnostic_bots import web_diagnostic_bot
from models import SystemInfo

system_info = SystemInfo(base_url="https://example.com")
report = await web_diagnostic_bot.run_diagnostics(system_info)
```

```python
# Use fix bots directly
from fix_bots import database_fix_bot

issues = [...]  # List of Issue objects
resolution_report = await database_fix_bot.resolve_issues(issues)
```

### **Monitoring and Metrics**

```python
from monitoring import monitoring_system

# Get comprehensive system status
status = monitoring_system.get_comprehensive_status()
print(f"Health Score: {status['system_health']['health_score']}")

# Export monitoring data
filepath = await monitoring_system.export_monitoring_data()
print(f"Data exported to: {filepath}")
```

### **Performance Monitoring**

```python
from monitoring import monitoring_system
from models import BotType

# Monitor bot operations
async with monitoring_system.performance_monitor.monitor_operation(
    bot_name="my_bot",
    bot_type=BotType.COORDINATOR,
    operation="troubleshooting"
):
    # Your bot operation here
    result = await some_bot_operation()
```

## 🔧 Configuration

### **System Settings** (`config.py`)

```python
class TroubleshootingConfig:
    # API Configuration
    openai_api_key: str
    agentops_api_key: Optional[str]
    
    # Database Configuration
    database_url: str
    database_max_connections: int = 10
    
    # Performance Settings
    diagnostic_timeout: int = 30
    fix_timeout: int = 60
    circuit_breaker_threshold: int = 5
    
    # BV Studios Integration
    bv_studios_base_url: str
    admin_api_endpoints: Dict[str, str]
```

### **Bot Roles** (`config.py`)

Each bot has defined roles, goals, and backstories for optimal CrewAI performance:

- **Execution timeouts** per bot type
- **Specialized expertise** areas
- **Clear responsibilities** and objectives

## 📈 Monitoring Features

### **Metrics Collection**
- **Counters**: Operation counts, success/failure rates
- **Gauges**: Current system states, resource usage
- **Timers**: Response times, execution durations
- **Performance Snapshots**: Complete operation analysis

### **Error Tracking**
- **Categorized errors** by type and severity
- **Error patterns** and trend analysis  
- **Bot-specific** error tracking
- **Automated recommendations** based on error patterns

### **Health Monitoring**
- **System health score** (0-100)
- **Component-level** health assessment
- **Automated alerts** for critical issues
- **Trend analysis** and performance optimization

## 🧪 Testing

### **Run All Examples**

```bash
python3 examples.py
```

### **Example Scenarios**

1. **Basic Troubleshooting**: Complete end-to-end workflow
2. **Coordinator Only**: Direct coordinator usage
3. **Individual Bots**: Testing diagnostic and fix bots separately  
4. **Monitoring**: Metrics collection and health monitoring
5. **Error Handling**: Resilience and error recovery testing

### **Custom Testing**

```python
from examples import TroubleshootingExamples

examples = TroubleshootingExamples()

# Run specific example
result = await examples.example_1_basic_troubleshooting()

# Run all examples
results = await examples.run_all_examples()
```

## 🔗 Integration with BV Studios

### **API Endpoints**

The system integrates with these BV Studios endpoints:

- `/api/admin/bots/health` - System health checks
- `/api/admin/bots/logs` - Recent system logs
- `/api/admin/bots/database` - Database connectivity tests
- `/api/admin/bots/content` - Content bot operations
- `/api/admin/bots/lead` - Lead bot operations

### **Authentication**

Uses existing BV Studios authentication system:
- NextAuth.js integration
- Vercel environment variables
- Admin dashboard access controls

## 📝 Data Models

### **Core Models** (`models.py`)

```python
# Issue representation
class Issue(BaseModel):
    id: str
    type: IssueType
    severity: Severity
    title: str
    description: str
    detected_by: BotType

# Diagnostic reporting
class DiagnosticReport(BaseModel):
    bot_name: str
    bot_type: BotType
    issues_found: List[Issue]
    health_status: str
    recommendations: List[str]

# Resolution tracking
class ResolutionReport(BaseModel):
    bot_name: str
    actions_attempted: List[FixAction]
    issues_resolved: List[str]
    overall_success: bool
```

## 🚨 Error Handling

### **Circuit Breaker Pattern**
- **Failure thresholds** with automatic recovery
- **Timeout protection** for all operations
- **Graceful degradation** when services unavailable

### **Retry Logic**
- **Exponential backoff** for transient failures
- **Maximum retry limits** to prevent infinite loops
- **Context-aware retries** based on error types

### **Comprehensive Logging**
- **Structured JSON logs** with full context
- **Error sanitization** to remove sensitive data  
- **Performance metrics** embedded in logs
- **Correlation IDs** for request tracing

## 🔒 Security

### **API Security**
- **Environment variable** configuration
- **No hardcoded credentials** in source code
- **Secure error messages** without sensitive data exposure

### **Data Handling**
- **Input validation** using Pydantic models
- **Safe error logging** with sensitive data filtering
- **Isolated bot execution** environments

## 🚀 Deployment

### **Production Considerations**

1. **Environment Variables**:
   - Set all required API keys
   - Configure database connections
   - Set appropriate log levels

2. **Resource Management**:
   - Monitor memory usage during bot operations
   - Set appropriate timeout values
   - Configure connection pooling

3. **Monitoring Setup**:
   - Export metrics to monitoring systems
   - Set up alerting for critical issues
   - Regular health check scheduling

### **Integration Steps**

1. Deploy Python environment with dependencies
2. Configure environment variables  
3. Test connectivity to BV Studios APIs
4. Set up monitoring and alerting
5. Schedule regular troubleshooting runs

## 📊 Performance

### **Execution Times**
- **Diagnostic Phase**: ~30-45 seconds for all 3 bots
- **Resolution Phase**: ~60-90 seconds depending on issues
- **Complete Workflow**: ~2-3 minutes end-to-end

### **Scalability**
- **Parallel execution** of diagnostic bots
- **Async/await patterns** throughout system
- **Circuit breaker protection** prevents cascading failures
- **Modular architecture** allows independent scaling

## 🤝 Contributing

### **Adding New Bots**

1. Create new bot class in appropriate file
2. Define bot configuration in `config.py`
3. Add bot to workflow orchestration
4. Update examples and documentation

### **Extending Monitoring**

1. Add new metric types in `monitoring.py`
2. Update health scoring algorithm
3. Add new alert conditions
4. Test with example scenarios

## 📚 References

- **CrewAI Documentation**: https://docs.crewai.com/
- **LangGraph Guide**: https://langchain-ai.github.io/langgraph/
- **BV Studios Platform**: Integration with existing bot system
- **Pydantic Models**: https://docs.pydantic.dev/

## 🆘 Support

For issues and questions:

1. Check the example scenarios in `examples.py`
2. Review logs and monitoring data
3. Verify environment variable configuration
4. Test individual components before full workflow
5. Check BV Studios API connectivity

---

**Built with ❤️ for BV Studios using CrewAI + LangGraph**