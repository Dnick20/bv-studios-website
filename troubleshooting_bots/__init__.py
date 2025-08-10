"""
BV Studios Hierarchical Troubleshooting Bot System
==================================================

A comprehensive troubleshooting system using CrewAI + LangGraph for automated
problem detection and resolution in the BV Studios web platform.

Architecture:
- TroubleshootingCoordinator: Main supervisor bot
- 6 specialized sub-bots for diagnostic and resolution tasks
- LangGraph StateGraph for workflow orchestration
- Async/await patterns for performance
- Comprehensive monitoring and logging

Author: Claude Code
Version: 1.0.0
"""

__version__ = "1.0.0"
__author__ = "Claude Code"