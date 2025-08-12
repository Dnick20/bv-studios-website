"""
Cursor AI Error Pattern Detection Module
Detects the specific types of issues that Cursor AI previously fixed
"""

import re
import json
from typing import List, Dict, Any, Optional
from datetime import datetime

from models import Issue, Severity, IssueType, BotType
from utils import StructuredLogger


class CursorAIPatternDetector:
    """
    Detects patterns of issues that Cursor AI previously fixed
    Helps prevent regression of these specific problems
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("cursor_ai_patterns")
        
        # Define the specific patterns Cursor AI fixed
        self.pattern_rules = [
            {
                "id": "prisma_singleton_violation",
                "pattern": r"new\s+PrismaClient\(\)",
                "severity": Severity.HIGH,
                "issue_type": IssueType.DATABASE_ERROR,
                "title": "Prisma Singleton Pattern Violation",
                "description": "Direct PrismaClient instantiation detected. Use singleton pattern from @/lib/prisma",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            },
            {
                "id": "old_nextauth_pattern",
                "pattern": r"getServerSession\(",
                "severity": Severity.MEDIUM,
                "issue_type": IssueType.AUTHENTICATION_ERROR,
                "title": "Deprecated NextAuth v4 Pattern",
                "description": "getServerSession usage detected. Migrate to NextAuth v5 auth() function",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            },
            {
                "id": "mixed_routing_systems",
                "pattern": r"pages/.*\.(js|ts|jsx|tsx)$",
                "severity": Severity.CRITICAL,
                "issue_type": IssueType.FRONTEND_ERROR,
                "title": "Pages Router Files in App Router Project",
                "description": "Legacy pages/ directory files detected. Remove to prevent routing conflicts",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            },
            {
                "id": "n_plus_one_query_pattern",
                "pattern": r"for\s*\([^}]*\)\s*\{[^}]*await\s+prisma\.[^.]+\.find",
                "severity": Severity.MEDIUM,
                "issue_type": IssueType.PERFORMANCE_ISSUE,
                "title": "Potential N+1 Query Pattern",
                "description": "Loop with individual Prisma queries detected. Consider using include/select",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            },
            {
                "id": "silent_error_handling",
                "pattern": r"catch\s*\([^)]*\)\s*\{\s*\}",
                "severity": Severity.MEDIUM,
                "issue_type": IssueType.FRONTEND_ERROR,
                "title": "Silent Error Handling",
                "description": "Empty catch block detected. Add proper error logging and handling",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            },
            {
                "id": "complex_client_auth",
                "pattern": r"getServerSession.*client.*component",
                "severity": Severity.HIGH,
                "issue_type": IssueType.AUTHENTICATION_ERROR,
                "title": "Server Auth in Client Component",
                "description": "Server-side auth logic in client component. Use client-side token validation",
                "file_extensions": [".js", ".ts", ".jsx", ".tsx"]
            }
        ]
    
    async def scan_codebase(self, base_path: str = ".") -> List[Issue]:
        """
        Scan the codebase for patterns that Cursor AI previously fixed
        """
        self.logger.info("Starting Cursor AI pattern detection scan", base_path=base_path)
        
        detected_issues = []
        
        try:
            import os
            
            # Walk through the codebase
            for root, dirs, files in os.walk(base_path):
                # Skip node_modules, .git, and other irrelevant directories
                dirs[:] = [d for d in dirs if not d.startswith(('.', 'node_modules', 'dist', 'build'))]
                
                for file in files:
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, base_path)
                    
                    # Check each pattern rule
                    for rule in self.pattern_rules:
                        if any(file.endswith(ext) for ext in rule["file_extensions"]):
                            issues = await self._scan_file_for_pattern(file_path, relative_path, rule)
                            detected_issues.extend(issues)
            
            self.logger.info(
                "Cursor AI pattern scan completed",
                issues_found=len(detected_issues),
                base_path=base_path
            )
            
            return detected_issues
            
        except Exception as e:
            self.logger.error("Cursor AI pattern scan failed", error=str(e))
            return []
    
    async def _scan_file_for_pattern(self, file_path: str, relative_path: str, rule: Dict[str, Any]) -> List[Issue]:
        """
        Scan a single file for a specific pattern
        """
        issues = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Search for the pattern
            matches = re.finditer(rule["pattern"], content, re.MULTILINE | re.IGNORECASE)
            
            for match in matches:
                # Calculate line number
                line_number = content[:match.start()].count('\n') + 1
                
                issue = Issue(
                    id=f"cursor_{rule['id']}_{hash(relative_path)}_{line_number}",
                    type=rule["issue_type"],
                    severity=rule["severity"],
                    title=rule["title"],
                    description=f"{rule['description']} (File: {relative_path}, Line: {line_number})",
                    component=relative_path,
                    detected_by=BotType.WEB_DIAGNOSTIC,  # Using web diagnostic as primary detector
                    error_messages=[f"Pattern '{rule['pattern']}' found at line {line_number}"],
                    context={
                        "file_path": relative_path,
                        "line_number": line_number,
                        "pattern_id": rule["id"],
                        "matched_text": match.group()[:100]  # First 100 chars of match
                    }
                )
                
                issues.append(issue)
                
                self.logger.info(
                    "Cursor AI pattern detected",
                    pattern_id=rule["id"],
                    file_path=relative_path,
                    line_number=line_number
                )
        
        except Exception as e:
            self.logger.error(
                "Failed to scan file for pattern",
                file_path=relative_path,
                pattern_id=rule["id"],
                error=str(e)
            )
        
        return issues
    
    def get_pattern_recommendations(self, issue: Issue) -> List[str]:
        """
        Get specific recommendations for fixing Cursor AI patterns
        """
        pattern_id = issue.context.get("pattern_id", "")
        
        recommendations = {
            "prisma_singleton_violation": [
                "Replace 'new PrismaClient()' with 'import { prisma } from '@/lib/prisma'",
                "Use the singleton instance to prevent connection pool exhaustion",
                "Ensure @/lib/prisma.js implements the global caching pattern"
            ],
            "old_nextauth_pattern": [
                "Replace 'getServerSession()' with 'auth()' from NextAuth v5",
                "Update import to 'import { auth } from '@/lib/auth'",
                "Ensure NextAuth v5 configuration is in place"
            ],
            "mixed_routing_systems": [
                "Remove all files from the pages/ directory",
                "Migrate remaining functionality to App Router in app/ directory",
                "Use page.js, layout.js, and route.js naming conventions"
            ],
            "n_plus_one_query_pattern": [
                "Replace individual queries with Prisma include/select",
                "Use findMany() with include: { relatedModel: true }",
                "Consider using Prisma's nested queries for better performance"
            ],
            "silent_error_handling": [
                "Add proper error logging in catch blocks",
                "Return structured error responses: { success: false, error: 'message' }",
                "Implement error boundaries for React components"
            ],
            "complex_client_auth": [
                "Move server auth logic to server components or API routes",
                "Use simple localStorage token validation in client components",
                "Implement proper auth state management"
            ]
        }
        
        return recommendations.get(pattern_id, [
            "Review the Cursor AI improvements analysis for specific guidance",
            "Implement proper error handling and logging",
            "Follow established patterns from lib/auth.js and lib/prisma.js"
        ])
    
    def generate_prevention_report(self, issues: List[Issue]) -> Dict[str, Any]:
        """
        Generate a comprehensive report on Cursor AI pattern violations
        """
        pattern_counts = {}
        severity_counts = {}
        file_impacts = {}
        
        for issue in issues:
            # Count by pattern
            pattern_id = issue.context.get("pattern_id", "unknown")
            pattern_counts[pattern_id] = pattern_counts.get(pattern_id, 0) + 1
            
            # Count by severity
            severity_counts[issue.severity.value] = severity_counts.get(issue.severity.value, 0) + 1
            
            # Count by file
            file_path = issue.context.get("file_path", "unknown")
            if file_path not in file_impacts:
                file_impacts[file_path] = []
            file_impacts[file_path].append(pattern_id)
        
        # Generate recommendations
        priority_fixes = []
        for pattern_id, count in sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True):
            if count > 0:
                priority_fixes.append({
                    "pattern": pattern_id,
                    "occurrences": count,
                    "severity": "HIGH" if count > 3 else "MEDIUM",
                    "recommendation": f"Fix {count} occurrences of {pattern_id.replace('_', ' ')}"
                })
        
        report = {
            "scan_timestamp": datetime.utcnow().isoformat(),
            "total_issues": len(issues),
            "pattern_breakdown": pattern_counts,
            "severity_distribution": severity_counts,
            "affected_files": len(file_impacts),
            "most_affected_files": dict(sorted(
                file_impacts.items(), 
                key=lambda x: len(x[1]), 
                reverse=True
            )[:10]),  # Top 10 most affected files
            "priority_fixes": priority_fixes,
            "overall_health_impact": self._calculate_health_impact(issues)
        }
        
        return report
    
    def _calculate_health_impact(self, issues: List[Issue]) -> str:
        """
        Calculate overall health impact of detected patterns
        """
        if not issues:
            return "EXCELLENT - No Cursor AI patterns detected"
        
        critical_count = sum(1 for issue in issues if issue.severity == Severity.CRITICAL)
        high_count = sum(1 for issue in issues if issue.severity == Severity.HIGH)
        
        if critical_count > 0:
            return "CRITICAL - Immediate attention required for routing conflicts"
        elif high_count > 5:
            return "POOR - Multiple high-impact patterns detected"
        elif high_count > 0:
            return "WARNING - Some high-impact patterns need attention"
        else:
            return "GOOD - Only minor pattern issues detected"


# Global pattern detector instance
cursor_ai_detector = CursorAIPatternDetector()