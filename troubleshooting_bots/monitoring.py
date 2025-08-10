"""
Comprehensive Monitoring, Logging, and Error Handling for Troubleshooting System
Provides structured logging, performance metrics, and error tracking
"""

import asyncio
import json
import os
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from contextlib import asynccontextmanager
from dataclasses import dataclass, asdict
from enum import Enum

from utils import StructuredLogger
from models import BotType, Severity


class MetricType(str, Enum):
    """Types of metrics we can collect"""
    COUNTER = "counter"
    GAUGE = "gauge" 
    HISTOGRAM = "histogram"
    TIMER = "timer"


@dataclass
class Metric:
    """Individual metric data point"""
    name: str
    type: MetricType
    value: float
    timestamp: datetime
    labels: Dict[str, str]
    unit: Optional[str] = None


@dataclass
class PerformanceSnapshot:
    """Performance snapshot for a bot operation"""
    bot_name: str
    bot_type: BotType
    operation: str
    start_time: datetime
    end_time: datetime
    duration_seconds: float
    success: bool
    error_message: Optional[str] = None
    memory_usage_mb: Optional[float] = None
    cpu_usage_percent: Optional[float] = None


class MetricsCollector:
    """Collects and aggregates performance metrics"""
    
    def __init__(self):
        self.metrics: List[Metric] = []
        self.performance_snapshots: List[PerformanceSnapshot] = []
        self.logger = StructuredLogger.get_logger("metrics_collector")
        
        # Metric aggregations
        self.counters: Dict[str, float] = {}
        self.gauges: Dict[str, float] = {}
        self.timers: Dict[str, List[float]] = {}
    
    def increment_counter(self, name: str, value: float = 1.0, labels: Optional[Dict[str, str]] = None):
        """Increment a counter metric"""
        self.counters[name] = self.counters.get(name, 0) + value
        
        metric = Metric(
            name=name,
            type=MetricType.COUNTER,
            value=value,
            timestamp=datetime.utcnow(),
            labels=labels or {},
            unit="count"
        )
        self.metrics.append(metric)
    
    def set_gauge(self, name: str, value: float, labels: Optional[Dict[str, str]] = None):
        """Set a gauge metric value"""
        self.gauges[name] = value
        
        metric = Metric(
            name=name,
            type=MetricType.GAUGE,
            value=value,
            timestamp=datetime.utcnow(),
            labels=labels or {}
        )
        self.metrics.append(metric)
    
    def record_timer(self, name: str, duration: float, labels: Optional[Dict[str, str]] = None):
        """Record a timing measurement"""
        if name not in self.timers:
            self.timers[name] = []
        self.timers[name].append(duration)
        
        metric = Metric(
            name=name,
            type=MetricType.TIMER,
            value=duration,
            timestamp=datetime.utcnow(),
            labels=labels or {},
            unit="seconds"
        )
        self.metrics.append(metric)
    
    def record_performance_snapshot(self, snapshot: PerformanceSnapshot):
        """Record a performance snapshot"""
        self.performance_snapshots.append(snapshot)
        
        # Update related metrics
        self.increment_counter(
            f"{snapshot.bot_name}_operations_total",
            labels={"operation": snapshot.operation, "success": str(snapshot.success)}
        )
        
        self.record_timer(
            f"{snapshot.bot_name}_duration_seconds",
            snapshot.duration_seconds,
            labels={"operation": snapshot.operation}
        )
        
        if snapshot.memory_usage_mb:
            self.set_gauge(
                f"{snapshot.bot_name}_memory_usage_mb",
                snapshot.memory_usage_mb,
                labels={"operation": snapshot.operation}
            )
        
        self.logger.info(
            "Performance snapshot recorded",
            bot_name=snapshot.bot_name,
            operation=snapshot.operation,
            duration=snapshot.duration_seconds,
            success=snapshot.success
        )
    
    def get_metric_summary(self) -> Dict[str, Any]:
        """Get summary of all collected metrics"""
        
        timer_summaries = {}
        for name, durations in self.timers.items():
            if durations:
                timer_summaries[name] = {
                    "count": len(durations),
                    "min": min(durations),
                    "max": max(durations), 
                    "avg": sum(durations) / len(durations),
                    "total": sum(durations)
                }
        
        return {
            "counters": self.counters,
            "gauges": self.gauges,
            "timers": timer_summaries,
            "total_metrics": len(self.metrics),
            "performance_snapshots": len(self.performance_snapshots),
            "collection_time": datetime.utcnow().isoformat()
        }
    
    def export_metrics(self, format_type: str = "json") -> str:
        """Export metrics in specified format"""
        
        if format_type == "json":
            return json.dumps({
                "metrics": [asdict(metric) for metric in self.metrics],
                "summary": self.get_metric_summary()
            }, indent=2, default=str)
        else:
            raise ValueError(f"Unsupported export format: {format_type}")


class ErrorTracker:
    """Tracks and categorizes errors across the troubleshooting system"""
    
    def __init__(self):
        self.errors: List[Dict[str, Any]] = []
        self.error_counts: Dict[str, int] = {}
        self.logger = StructuredLogger.get_logger("error_tracker")
    
    def record_error(self, 
                    bot_name: str,
                    bot_type: BotType, 
                    operation: str,
                    error: Exception,
                    severity: Severity = Severity.MEDIUM,
                    context: Optional[Dict[str, Any]] = None):
        """Record an error occurrence"""
        
        error_data = {
            "bot_name": bot_name,
            "bot_type": bot_type.value,
            "operation": operation,
            "error_type": type(error).__name__,
            "error_message": str(error),
            "severity": severity.value,
            "timestamp": datetime.utcnow().isoformat(),
            "context": context or {}
        }
        
        self.errors.append(error_data)
        
        # Update error counts
        error_key = f"{bot_name}:{type(error).__name__}"
        self.error_counts[error_key] = self.error_counts.get(error_key, 0) + 1
        
        self.logger.error(
            "Error recorded",
            bot_name=bot_name,
            operation=operation,
            error_type=type(error).__name__,
            error_message=str(error),
            severity=severity.value
        )
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get summary of tracked errors"""
        
        if not self.errors:
            return {"total_errors": 0, "error_types": {}, "recent_errors": []}
        
        # Count errors by type
        error_type_counts = {}
        severity_counts = {}
        bot_error_counts = {}
        
        recent_errors = []
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        
        for error in self.errors:
            error_type = error["error_type"]
            severity = error["severity"]
            bot_name = error["bot_name"]
            
            error_type_counts[error_type] = error_type_counts.get(error_type, 0) + 1
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
            bot_error_counts[bot_name] = bot_error_counts.get(bot_name, 0) + 1
            
            # Collect recent errors
            error_time = datetime.fromisoformat(error["timestamp"])
            if error_time > cutoff_time:
                recent_errors.append(error)
        
        return {
            "total_errors": len(self.errors),
            "error_types": error_type_counts,
            "severity_distribution": severity_counts,
            "bot_error_counts": bot_error_counts,
            "recent_errors": recent_errors[-10:],  # Last 10 recent errors
            "most_common_errors": sorted(
                self.error_counts.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:5]
        }
    
    def get_error_patterns(self) -> List[str]:
        """Analyze error patterns and return insights"""
        
        patterns = []
        
        if not self.errors:
            return ["No errors recorded"]
        
        # Analyze error frequency
        if len(self.errors) > 50:
            patterns.append("High error volume detected - consider system health review")
        
        # Analyze error types
        error_types = {}
        for error in self.errors:
            error_type = error["error_type"]
            error_types[error_type] = error_types.get(error_type, 0) + 1
        
        most_common_error = max(error_types.items(), key=lambda x: x[1])
        if most_common_error[1] > 10:
            patterns.append(f"Recurring error pattern: {most_common_error[0]} ({most_common_error[1]} occurrences)")
        
        # Analyze bot-specific errors
        bot_errors = {}
        for error in self.errors:
            bot_name = error["bot_name"]
            bot_errors[bot_name] = bot_errors.get(bot_name, 0) + 1
        
        problematic_bots = [name for name, count in bot_errors.items() if count > 5]
        if problematic_bots:
            patterns.append(f"Bots with frequent errors: {', '.join(problematic_bots)}")
        
        return patterns if patterns else ["No significant error patterns detected"]


class PerformanceMonitor:
    """Monitors performance of bot operations with context management"""
    
    def __init__(self, metrics_collector: MetricsCollector, error_tracker: ErrorTracker):
        self.metrics_collector = metrics_collector
        self.error_tracker = error_tracker
        self.logger = StructuredLogger.get_logger("performance_monitor")
    
    @asynccontextmanager
    async def monitor_operation(self, 
                               bot_name: str,
                               bot_type: BotType,
                               operation: str,
                               context: Optional[Dict[str, Any]] = None):
        """Context manager for monitoring bot operations"""
        
        start_time = datetime.utcnow()
        success = False
        error_message = None
        
        self.logger.info(
            "Starting monitored operation",
            bot_name=bot_name,
            operation=operation,
            start_time=start_time.isoformat()
        )
        
        try:
            yield self
            success = True
            
        except Exception as e:
            success = False
            error_message = str(e)
            
            # Record the error
            self.error_tracker.record_error(
                bot_name=bot_name,
                bot_type=bot_type,
                operation=operation,
                error=e,
                context=context
            )
            
            self.logger.error(
                "Operation failed",
                bot_name=bot_name,
                operation=operation,
                error=str(e)
            )
            
            raise
            
        finally:
            end_time = datetime.utcnow()
            duration = (end_time - start_time).total_seconds()
            
            # Record performance snapshot
            snapshot = PerformanceSnapshot(
                bot_name=bot_name,
                bot_type=bot_type,
                operation=operation,
                start_time=start_time,
                end_time=end_time,
                duration_seconds=duration,
                success=success,
                error_message=error_message
            )
            
            self.metrics_collector.record_performance_snapshot(snapshot)
            
            self.logger.info(
                "Operation completed",
                bot_name=bot_name,
                operation=operation,
                duration=duration,
                success=success
            )


class SystemHealthMonitor:
    """Monitors overall system health and generates alerts"""
    
    def __init__(self, 
                 metrics_collector: MetricsCollector,
                 error_tracker: ErrorTracker):
        self.metrics_collector = metrics_collector
        self.error_tracker = error_tracker
        self.logger = StructuredLogger.get_logger("system_health_monitor")
        
        # Health thresholds
        self.error_rate_threshold = 0.1  # 10% error rate
        self.response_time_threshold = 30.0  # 30 seconds
        self.memory_threshold_mb = 1000.0  # 1GB
    
    def calculate_health_score(self) -> float:
        """Calculate overall system health score (0-100)"""
        
        score = 100.0
        
        # Analyze error rates
        error_summary = self.error_tracker.get_error_summary()
        total_errors = error_summary["total_errors"]
        
        if total_errors > 0:
            # Get total operations from metrics
            metric_summary = self.metrics_collector.get_metric_summary()
            total_operations = sum(metric_summary["counters"].values()) or 1
            
            error_rate = total_errors / total_operations
            if error_rate > self.error_rate_threshold:
                score -= 30  # High error rate penalty
            elif error_rate > self.error_rate_threshold / 2:
                score -= 15  # Medium error rate penalty
        
        # Analyze response times
        timer_summaries = self.metrics_collector.get_metric_summary()["timers"]
        for timer_name, timer_data in timer_summaries.items():
            avg_response_time = timer_data["avg"]
            if avg_response_time > self.response_time_threshold:
                score -= 20  # Slow response penalty
            elif avg_response_time > self.response_time_threshold / 2:
                score -= 10  # Medium response time penalty
        
        # Analyze critical errors
        critical_errors = sum(
            1 for error in self.error_tracker.errors
            if error.get("severity") == Severity.CRITICAL.value
        )
        score -= critical_errors * 10  # 10 points per critical error
        
        return max(0.0, score)
    
    def generate_health_report(self) -> Dict[str, Any]:
        """Generate comprehensive system health report"""
        
        health_score = self.calculate_health_score()
        metric_summary = self.metrics_collector.get_metric_summary()
        error_summary = self.error_tracker.get_error_summary()
        error_patterns = self.error_tracker.get_error_patterns()
        
        # Determine health status
        if health_score >= 90:
            health_status = "excellent"
        elif health_score >= 75:
            health_status = "good"
        elif health_score >= 50:
            health_status = "warning"
        elif health_score >= 25:
            health_status = "poor"
        else:
            health_status = "critical"
        
        # Generate recommendations
        recommendations = self._generate_health_recommendations(
            health_score, metric_summary, error_summary
        )
        
        return {
            "health_score": health_score,
            "health_status": health_status,
            "timestamp": datetime.utcnow().isoformat(),
            "metrics_summary": metric_summary,
            "error_summary": error_summary,
            "error_patterns": error_patterns,
            "recommendations": recommendations,
            "system_alerts": self._generate_system_alerts(health_score, error_summary)
        }
    
    def _generate_health_recommendations(self, 
                                       health_score: float,
                                       metric_summary: Dict[str, Any],
                                       error_summary: Dict[str, Any]) -> List[str]:
        """Generate health improvement recommendations"""
        
        recommendations = []
        
        if health_score < 50:
            recommendations.append("URGENT: System health is critical - immediate attention required")
        
        if error_summary["total_errors"] > 50:
            recommendations.append("High error volume detected - review error patterns and implement fixes")
        
        # Check for slow operations
        for timer_name, timer_data in metric_summary["timers"].items():
            if timer_data["avg"] > self.response_time_threshold:
                recommendations.append(f"Slow operation detected: {timer_name} - consider optimization")
        
        # Check for error patterns
        if error_summary.get("most_common_errors"):
            most_common = error_summary["most_common_errors"][0]
            recommendations.append(f"Address recurring error: {most_common[0]} ({most_common[1]} occurrences)")
        
        if health_score >= 90:
            recommendations.append("System is performing excellently - maintain current practices")
        
        return recommendations if recommendations else ["No specific recommendations at this time"]
    
    def _generate_system_alerts(self, health_score: float, error_summary: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate system alerts based on health metrics"""
        
        alerts = []
        
        if health_score < 25:
            alerts.append({
                "level": "critical",
                "message": "System health is critically low",
                "action_required": True
            })
        elif health_score < 50:
            alerts.append({
                "level": "warning", 
                "message": "System health is below acceptable levels",
                "action_required": True
            })
        
        # Check for recent critical errors
        recent_critical = sum(
            1 for error in error_summary.get("recent_errors", [])
            if error.get("severity") == Severity.CRITICAL.value
        )
        
        if recent_critical > 0:
            alerts.append({
                "level": "critical",
                "message": f"{recent_critical} critical errors in the last hour",
                "action_required": True
            })
        
        return alerts


class MonitoringSystem:
    """Central monitoring system that coordinates all monitoring components"""
    
    def __init__(self):
        self.metrics_collector = MetricsCollector()
        self.error_tracker = ErrorTracker()
        self.performance_monitor = PerformanceMonitor(
            self.metrics_collector, 
            self.error_tracker
        )
        self.health_monitor = SystemHealthMonitor(
            self.metrics_collector,
            self.error_tracker
        )
        self.logger = StructuredLogger.get_logger("monitoring_system")
        
        self.logger.info("Monitoring system initialized")
    
    def get_comprehensive_status(self) -> Dict[str, Any]:
        """Get comprehensive system monitoring status"""
        
        health_report = self.health_monitor.generate_health_report()
        
        return {
            "monitoring_system": {
                "status": "active",
                "uptime": "monitoring since system start",
                "components": {
                    "metrics_collector": "active",
                    "error_tracker": "active", 
                    "performance_monitor": "active",
                    "health_monitor": "active"
                }
            },
            "system_health": health_report,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    async def export_monitoring_data(self, filepath: Optional[str] = None) -> str:
        """Export all monitoring data to file"""
        
        monitoring_data = self.get_comprehensive_status()
        
        if not filepath:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            filepath = f"troubleshooting_monitoring_{timestamp}.json"
        
        try:
            with open(filepath, 'w') as f:
                json.dump(monitoring_data, f, indent=2, default=str)
            
            self.logger.info("Monitoring data exported", filepath=filepath)
            return filepath
            
        except Exception as e:
            self.logger.error("Failed to export monitoring data", error=str(e))
            raise


# Global monitoring system instance
monitoring_system = MonitoringSystem()