import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Layers, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

interface JetpackComposeCodeViewerProps {
  onOpenInstallGuide?: () => void;
}

export const JetpackComposeCodeViewer: React.FC<JetpackComposeCodeViewerProps> = ({ onOpenInstallGuide }) => {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<'Screen' | 'Theme' | 'Components'>('Screen');

  const kotlinScreenCode = `package com.sumedha.techinfra.ui

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sumedha.techinfra.theme.*

/**
 * Sumedha Tech Infra IT Service Manager - Main Dashboard Screen
 * Built with Material 3 & Jetpack Compose
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SumedhaDashboardScreen(
    onNavigateToTasks: () -> Unit,
    onNavigateToCustomers: () -> Unit,
    onNavigateToBilling: () -> Unit,
    onNewTicketClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        containerColor = SumedhaNavyDark,
        topBar = {
            SumedhaTopAppBar(
                userName = "Hardik Rangani",
                userRole = "IT Operations Director",
                unreadNotifications = 3,
                onNotificationClick = { /* Open Notification Drawer */ }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNewTicketClick,
                containerColor = SumedhaElectricCyan,
                contentColor = Color(0xFF070B14),
                shape = RoundedCornerShape(16.dp),
                elevation = FloatingActionButtonDefaults.elevation(8.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Dispatch Service Ticket")
            }
        },
        bottomBar = {
            SumedhaBottomNavigationBar(
                currentRoute = "dashboard",
                onTabSelect = { /* Navigate */ }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Hero Card: Service Overview
            item {
                ServiceOverviewHeroCard(
                    activeRepairs = 3,
                    pendingDispatch = 2,
                    urgentSLAs = 1,
                    slaAdherenceRate = 98.4f,
                    onQuickDispatch = onNewTicketClick
                )
            }

            // 2. 4 Colorful Graphic Statistic Cards
            item {
                StatisticCardsGrid(
                    totalTasks = 8,
                    pending = 2,
                    inProgress = 2,
                    solved = 3,
                    onFilterSelect = { /* Filter tasks */ }
                )
            }

            // 3. Status Donut Chart & Weekly Bar Chart Section
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatusDonutChartCard(modifier = Modifier.weight(1f))
                }
            }

            item {
                WeeklyServiceCallBarChartCard(
                    weeklyData = listOf(
                        DayMetric("Mon", 8, 7),
                        DayMetric("Tue", 12, 11),
                        DayMetric("Wed", 15, 14),
                        DayMetric("Thu", 11, 13),
                        DayMetric("Fri", 14, 12),
                        DayMetric("Sat", 9, 10),
                        DayMetric("Sun", 4, 5)
                    )
                )
            }

            // 4. Quick Action Buttons
            item {
                QuickActionStrip(
                    onNewTask = onNewTicketClick,
                    onAddCustomer = onNavigateToCustomers,
                    onCreateInvoice = onNavigateToBilling,
                    onViewReports = { /* Open Reports */ }
                )
            }

            // 5. Recent Service Calls Section
            item {
                SectionHeader(title = "Recent Service Calls", count = 6, onSeeAll = onNavigateToTasks)
            }

            // 6. Technician Performance Section
            item {
                SectionHeader(title = "Technician Performance", count = 3, onSeeAll = {})
                TechnicianPerformanceRow()
            }

            // 7. Monthly Billing Overview
            item {
                MonthlyBillingCard(
                    totalRevenue = 845000.0,
                    collectedAmount = 615000.0,
                    outstanding = 230000.0
                )
            }

            item { Spacer(modifier = Modifier.height(80.dp)) }
        }
    }
}
`;

  const kotlinThemeCode = `package com.sumedha.techinfra.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Sumedha Tech Infra Color Palette
val SumedhaNavyDark = Color(0xFF070B14)
val SumedhaNavySurface = Color(0xFF0C1527)
val SumedhaNavyElevated = Color(0xFF131F3B)
val SumedhaElectricCyan = Color(0xFF06B6D4)
val SumedhaNeonCyan = Color(0xFF22D3EE)
val SumedhaElectricBlue = Color(0xFF2563EB)
val SumedhaEmerald = Color(0xFF10B981)
val SumedhaAmber = Color(0xFFF59E0B)
val SumedhaRose = Color(0xFFF43F5E)

private val DarkColorScheme = darkColorScheme(
    primary = SumedhaElectricCyan,
    onPrimary = Color(0xFF070B14),
    primaryContainer = Color(0xFF0B223F),
    secondary = SumedhaElectricBlue,
    background = SumedhaNavyDark,
    surface = SumedhaNavySurface,
    surfaceVariant = SumedhaNavyElevated,
    onBackground = Color(0xFFF1F5F9),
    onSurface = Color(0xFFF1F5F9),
    error = SumedhaRose
)

@Composable
fun SumedhaTechInfraTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography(),
        content = content
    )
}
`;

  const kotlinComponentsCode = `package com.sumedha.techinfra.ui.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sumedha.techinfra.theme.*

@Composable
fun ServiceOverviewHeroCard(
    activeRepairs: Int,
    pendingDispatch: Int,
    urgentSLAs: Int,
    slaAdherenceRate: Float,
    onQuickDispatch: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, SumedhaElectricCyan.copy(alpha = 0.3f), RoundedCornerShape(24.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(Color(0xFF0C1B3A), Color(0xFF09152E), Color(0xFF060C1D))
                ),
                shape = RoundedCornerShape(24.dp)
            )
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "OPERATIONS CONTROL CENTER",
                color = SumedhaNeonCyan,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Service Overview",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "$activeRepairs repairs active, $pendingDispatch pending, $urgentSLAs urgent emergency tickets.",
                color = Color(0xFFCBD5E1),
                fontSize = 13.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = onQuickDispatch,
                colors = ButtonDefaults.buttonColors(containerColor = SumedhaElectricCyan),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.AddCircle, contentDescription = null, tint = Color(0xFF070B14))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Dispatch Ticket", color = Color(0xFF070B14), fontWeight = FontWeight.Bold)
            }
        }
    }
}
`;

  const getActiveCode = () => {
    switch (activeFile) {
      case 'Screen':
        return kotlinScreenCode;
      case 'Theme':
        return kotlinThemeCode;
      case 'Components':
        return kotlinComponentsCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getActiveCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sumedha_${activeFile}.kt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#070d1a] border border-cyan-500/20 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                Android Jetpack Compose
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Production Ready Kotlin
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Android Studio Code Inspector
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* File Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['Screen', 'Theme', 'Components'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFile(tab)}
                className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                  activeFile === tab ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}.kt
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Kotlin'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors cursor-pointer"
            title="Download .kt file"
          >
            <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </button>

          {onOpenInstallGuide && (
            <button
              onClick={onOpenInstallGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              title="View Complete Android Studio Project & APK Build Instructions"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APK Build Guide</span>
            </button>
          )}
        </div>
      </div>

      {/* Code Container */}
      <div className="relative rounded-2xl bg-[#040810] border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-96 text-cyan-100 leading-relaxed scrollbar-thin">
        <pre className="whitespace-pre">
          {getActiveCode()}
        </pre>
      </div>

      <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
        <span>Ready to import into Android Studio Hedgehog / Iguana / Ladybug</span>
        <span className="font-mono text-cyan-400">Target SDK: 35 · Material 3</span>
      </div>
    </div>
  );
};
