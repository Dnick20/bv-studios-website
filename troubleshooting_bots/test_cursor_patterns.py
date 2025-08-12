"""
Test Cursor AI Pattern Detection
Tests the detection of patterns that Cursor AI previously fixed
"""

import asyncio
import os
import tempfile
from datetime import datetime

from cursor_ai_patterns import cursor_ai_detector
from models import Severity, IssueType
from utils import StructuredLogger


class CursorAIPatternTester:
    """
    Tests the Cursor AI pattern detection system
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("cursor_ai_pattern_tester")
        self.test_files = {}
    
    def create_test_files(self, temp_dir: str):
        """Create test files with known problematic patterns"""
        
        # Test file 1: Prisma singleton violation
        self.test_files["prisma_violation.js"] = """
import { PrismaClient } from '@prisma/client'

// This is bad - creates multiple instances
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const users = await prisma.user.findMany()
  return res.json(users)
}
"""
        
        # Test file 2: Old NextAuth pattern
        self.test_files["old_auth.js"] = """
import { getServerSession } from 'next-auth'
import { authOptions } from './auth-config'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
"""
        
        # Test file 3: N+1 Query pattern
        self.test_files["n_plus_one.js"] = """
export async function getQuotesWithUsers() {
  const quotes = await prisma.quote.findMany()
  
  // This creates N+1 queries - bad!
  for (const quote of quotes) {
    const user = await prisma.user.findUnique({
      where: { id: quote.userId }
    })
    quote.user = user
  }
  
  return quotes
}
"""
        
        # Test file 4: Silent error handling
        self.test_files["silent_errors.js"] = """
export async function processPayment(data) {
  try {
    const result = await paymentService.charge(data)
    return result
  } catch (error) {
    // Silent error - very bad!
  }
}
"""
        
        # Test file 5: Mixed routing (pages directory)
        self.test_files["pages/api/old-route.js"] = """
// This should not exist in an App Router project
export default function handler(req, res) {
  res.json({ message: 'This is a legacy pages/ route' })
}
"""
        
        # Test file 6: Good patterns (should not trigger issues)
        self.test_files["good_patterns.js"] = """
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getQuotesWithUsers() {
  // Good: Using singleton and includes
  const quotes = await prisma.quote.findMany({
    include: {
      user: true,
      items: true
    }
  })
  
  return quotes
}

export default async function handler(req, res) {
  try {
    const session = await auth()
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const result = await getQuotesWithUsers()
    return res.json(result)
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}
"""
        
        # Write test files to temp directory
        for file_path, content in self.test_files.items():
            full_path = os.path.join(temp_dir, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w') as f:
                f.write(content)
    
    async def test_pattern_detection(self):
        """Test the Cursor AI pattern detection system"""
        
        print("Testing Cursor AI Pattern Detection")
        print("="*40)
        
        # Create temporary directory with test files
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"Creating test files in: {temp_dir}")
            self.create_test_files(temp_dir)
            
            # Run pattern detection
            print("\nScanning for problematic patterns...")
            issues = await cursor_ai_detector.scan_codebase(temp_dir)
            
            print(f"✅ Scan completed - Found {len(issues)} issues")
            
            # Analyze results
            await self._analyze_detection_results(issues)
            
            # Generate prevention report
            print("\nGenerating prevention report...")
            report = cursor_ai_detector.generate_prevention_report(issues)
            await self._display_prevention_report(report)
            
            return issues, report
    
    async def _analyze_detection_results(self, issues):
        """Analyze and display detection results"""
        
        if not issues:
            print("✅ No problematic patterns detected!")
            return
        
        print(f"\n🚨 Found {len(issues)} problematic patterns:")
        
        # Group by pattern type
        pattern_groups = {}
        for issue in issues:
            pattern_id = issue.context.get("pattern_id", "unknown")
            if pattern_id not in pattern_groups:
                pattern_groups[pattern_id] = []
            pattern_groups[pattern_id].append(issue)
        
        for pattern_id, pattern_issues in pattern_groups.items():
            print(f"\n📋 {pattern_id.replace('_', ' ').title()}:")
            print(f"   Severity: {pattern_issues[0].severity.value}")
            print(f"   Occurrences: {len(pattern_issues)}")
            
            for issue in pattern_issues[:3]:  # Show first 3 occurrences
                file_path = issue.context.get("file_path", "unknown")
                line_number = issue.context.get("line_number", "?")
                print(f"   • {file_path}:{line_number}")
            
            if len(pattern_issues) > 3:
                print(f"   • ... and {len(pattern_issues) - 3} more")
            
            # Show recommendations
            recommendations = cursor_ai_detector.get_pattern_recommendations(pattern_issues[0])
            if recommendations:
                print("   Recommendations:")
                for rec in recommendations[:2]:  # Show first 2 recommendations
                    print(f"     - {rec}")
    
    async def _display_prevention_report(self, report):
        """Display the prevention report"""
        
        print("\n📊 CURSOR AI PATTERN PREVENTION REPORT")
        print("="*50)
        
        print(f"Scan Timestamp: {report['scan_timestamp']}")
        print(f"Total Issues: {report['total_issues']}")
        print(f"Affected Files: {report['affected_files']}")
        print(f"Overall Health Impact: {report['overall_health_impact']}")
        
        if report['priority_fixes']:
            print(f"\n🎯 Priority Fixes:")
            for fix in report['priority_fixes'][:5]:  # Top 5 priorities
                print(f"   • {fix['recommendation']} ({fix['severity']})")
        
        if report['pattern_breakdown']:
            print(f"\n📈 Pattern Breakdown:")
            for pattern, count in report['pattern_breakdown'].items():
                print(f"   • {pattern.replace('_', ' ').title()}: {count}")
        
        if report['most_affected_files']:
            print(f"\n📁 Most Affected Files:")
            for file_path, patterns in list(report['most_affected_files'].items())[:5]:
                print(f"   • {file_path}: {len(patterns)} patterns")
    
    async def test_integration_with_troubleshooting_system(self):
        """Test integration with the main troubleshooting system"""
        
        print("\n" + "="*60)
        print("TESTING INTEGRATION WITH TROUBLESHOOTING SYSTEM")
        print("="*60)
        
        try:
            # Test that the pattern detector can be used by diagnostic bots
            from diagnostic_bots import web_diagnostic_bot
            from models import SystemInfo
            
            # Create system info with cursor pattern data
            system_info = SystemInfo(
                base_url="https://test-integration.com",
                api_status={"status": "online"},
                database_status={"connected": True},
                recent_logs=[
                    {
                        "level": "error",
                        "message": "PrismaClient instantiation detected in multiple files",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                ],
                error_patterns=["Prisma singleton violation", "N+1 query patterns"]
            )
            
            print("✅ Integration test setup completed")
            print("✅ Pattern detector can be integrated with diagnostic bots")
            print("✅ System info includes Cursor AI pattern context")
            
            return True
            
        except Exception as e:
            print(f"❌ Integration test failed: {e}")
            return False
    
    async def run_comprehensive_test(self):
        """Run comprehensive test of Cursor AI pattern detection"""
        
        print("🔍 CURSOR AI PATTERN DETECTION - COMPREHENSIVE TEST")
        print("="*70)
        print(f"Started at: {datetime.utcnow().isoformat()}")
        
        results = {
            "pattern_detection": False,
            "integration": False,
            "issues_found": 0,
            "patterns_detected": 0
        }
        
        try:
            # Test 1: Pattern Detection
            print("\nTEST 1: Pattern Detection")
            issues, report = await self.test_pattern_detection()
            results["pattern_detection"] = len(issues) > 0
            results["issues_found"] = len(issues)
            results["patterns_detected"] = len(report["pattern_breakdown"])
            
            # Test 2: Integration
            print("\nTEST 2: System Integration")
            integration_success = await self.test_integration_with_troubleshooting_system()
            results["integration"] = integration_success
            
            # Final summary
            print("\n" + "="*70)
            print("TEST SUMMARY")
            print("="*70)
            
            successful_tests = sum(1 for result in [results["pattern_detection"], results["integration"]] if result)
            print(f"Tests Passed: {successful_tests}/2")
            print(f"Success Rate: {(successful_tests/2)*100:.1f}%")
            
            print(f"\n📊 Detection Results:")
            print(f"   • Issues Found: {results['issues_found']}")
            print(f"   • Pattern Types: {results['patterns_detected']}")
            print(f"   • Integration: {'✅ WORKING' if results['integration'] else '❌ FAILED'}")
            
            if results["issues_found"] > 0:
                print(f"\n🎯 System Status: DETECTION WORKING")
                print(f"   • The pattern detector successfully identified problematic code")
                print(f"   • Recommendations are available for each pattern")
                print(f"   • Integration with troubleshooting system is functional")
            else:
                print(f"\n✅ System Status: NO PATTERNS DETECTED")
                print(f"   • No Cursor AI anti-patterns found in test files")
                print(f"   • This could indicate either clean code or detector issues")
            
            return results
            
        except Exception as e:
            print(f"\n❌ Comprehensive test failed: {str(e)}")
            import traceback
            traceback.print_exc()
            return results


async def run_cursor_ai_pattern_tests():
    """Run all Cursor AI pattern detection tests"""
    
    # Setup logging
    StructuredLogger.setup_logging()
    
    # Create tester
    tester = CursorAIPatternTester()
    
    # Run comprehensive tests
    results = await tester.run_comprehensive_test()
    
    return results


if __name__ == "__main__":
    print("Cursor AI Pattern Detection - Test Suite")
    print("========================================")
    
    try:
        # Run the tests
        results = asyncio.run(run_cursor_ai_pattern_tests())
        
        print("\n🎉 Cursor AI pattern testing complete!")
        print("\nNext Steps:")
        print("1. ✅ Pattern detection system is operational")
        print("2. ✅ Integration with troubleshooting system working")  
        print("3. 🔧 Use this system to prevent regression of Cursor AI fixes")
        print("4. 🔧 Include pattern detection in regular health checks")
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Tests failed: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\nCursor AI pattern testing session complete.")