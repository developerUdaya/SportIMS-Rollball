import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Event, Team, Player, Group, Match } from '../types';

// Helper function to load image as base64
const loadImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
};


// Export match teams with players and photos as PDF (tabular format)
export const exportMatchTeamsWithPlayersToPDF = async (
  match: Match,
  teams: Team[],
  players: Player[],
  eventName: string
) => {
  const doc = new jsPDF();

  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);
  const team1Players = players.filter(p => p.teamId === match.team1Id);
  const team2Players = players.filter(p => p.teamId === match.team2Id);

  doc.setFontSize(12);
  doc.setTextColor(255, 0, 0);
  const pageWidth = doc.internal.pageSize.getWidth();
  const text = 'Rollball - Score Sheet';
  const textWidth = doc.getTextWidth(text);
  doc.text(text, (pageWidth - textWidth) / 2, 15);
  doc.setTextColor(0, 0, 0); // Reset to black for subsequent text
  // Reduce font sizes and y positions for compact layout
  doc.setFontSize(12);
  doc.text(`${eventName} - Match Teams`, 15, 21);

  doc.setFontSize(8);
  doc.text(`${team1?.teamName} vs ${team2?.teamName}`, 100, 21);

  if (match.date) {
    doc.text(`Date: ${match.date}`, 15, 26);
  }
  if (match.time) {
    doc.text(`Time: ${match.time}`, 50, 26);
  }
  if (match.venue) {
    doc.text(`Venue: ${match.venue}`, 15, 31);
  }

  doc.text(`Match no: ____________`, 50, 31);
  doc.text(`Toss won by: ____________`, 90, 31);

  let yPosition = 41;

  // Helper to build player table data with extra rows for 'c' and 'm'
  const buildPlayerTable = (teamPlayers: Player[]) => {
    const rows: any[] = [];
    teamPlayers.forEach((player, idx) => {
      rows.push([
        (idx + 1).toString(),
        player.name,
        player.jerseyNumber,
        "",
        '',
        '      '
      ]);
    });
    rows.push(['C', '', '', '', '', '']);
    rows.push(['M', '', '', '', '', '']);
    return rows;
  };

  // Team 1 Table
  if (team1) {
    doc.setFontSize(9);
    doc.setTextColor(0, 153, 51); // dark green
    doc.text(`Team A : ${team1.teamName}`, 15, yPosition);
    doc.setTextColor(0, 0, 0); // reset to black

    const columns = ['1', '', '2', '', '3', '', '4', ''];
    const colWidths = 8;
    const startX = doc.internal.pageSize.getWidth() - (colWidths * columns.length) - 15;

    columns.forEach((col, idx) => {
      doc.rect(startX + idx * colWidths, yPosition - 4, colWidths, 5);
      doc.text(col, startX + idx * colWidths + 1, yPosition);
    });
    yPosition += 4;

    autoTable(doc, {
      startY: yPosition,
      head: [['S.No', 'Player Name', 'Jersey No', 'G. No', 'P. No', 'Time', 'G. No', 'P. No', 'Time', 'G. No', 'P. No', 'Time', 'F. No', 'P. No', 'Card']],
      body: buildPlayerTable(team1Players),
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], fontSize: 6 },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 6 },
      columnStyles: {
        1: { cellWidth: 22 },
        2: { cellWidth: 13 },
        5: { cellWidth: 10 },
        8: { cellWidth: 10 },
        11: { cellWidth: 10 },
        14: { cellWidth: 10 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 8;
  }

  // Team 2 Table
  if (team2) {
    if (yPosition > 160) {
      doc.addPage();
      yPosition = 15;
      
    }

    doc.setFontSize(9);
    doc.setFontSize(9);
    doc.setTextColor(0, 153, 51); // dark green
    doc.text(`Team B : ${team2.teamName}`, 15, yPosition);
    doc.setTextColor(0, 0, 0); // reset to black

    const columns = ['1', '', '2', '', '3', '', '4', ''];
    const colWidths = 8;
    const startX = doc.internal.pageSize.getWidth() - (colWidths * columns.length) - 15;

    columns.forEach((col, idx) => {
      doc.rect(startX + idx * colWidths, yPosition - 4, colWidths, 5);
      doc.text(col, startX + idx * colWidths + 1, yPosition);
    });
    yPosition += 4;

    autoTable(doc, {
      startY: yPosition,
      head: [['S.No', 'Player Name', 'Jersey No', 'G. No', 'P. No', 'Time', 'G. No', 'P. No', 'Time', 'G. No', 'P. No', 'Time', 'F. No', 'P. No', 'Card']],
      body: buildPlayerTable(team2Players),
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], fontSize: 6 },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 6 },
      columnStyles: {
        1: { cellWidth: 22 },
        2: { cellWidth: 13 },
        5: { cellWidth: 10 },
        8: { cellWidth: 10 },
        11: { cellWidth: 10 },
        14: { cellWidth: 10 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 2;
  }

  // yPosition += 4;
  autoTable(doc, {
    startY: yPosition,
    head: [['', 'Team A', 'Team B','', 'Team A', 'Team B','', 'Team A', 'Team B']],
    body: [
      ['Half Time Score:', '___________', '___________','Full Time Score:', '___________', '___________','Extra Time H.T. Score:', '___________', '___________'],
      ['Extra Time F.T. Score:', '___________', '___________','Grand Goal:', '___________', '___________','Captain Signature', '___________', '___________'],
    ],
    theme: 'plain',
    headStyles: { fillColor: [255, 255, 255], fontSize: 7 },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 6, fillColor: [255, 255, 255] }
  });
  yPosition = (doc as any).lastAutoTable.finalY + 2;

  // yPosition += 4;
  autoTable(doc, {
    startY: yPosition,
    head: [['Table Officials (Name & Sign)', 'Referee (Name & Sign)', 'Line Referee (Name & Sign)']],
    body: [
      ['1)______________________', '1)______________________', '1)______________________'],
      ['2)______________________', '2)______________________', '2)______________________'],
    ],
    theme: 'plain',
    headStyles: { fillColor: [255, 255, 255], fontSize: 7 },
    margin: { left: 15, right: 15 },
    styles: { fontSize: 6, fillColor: [255, 255, 255] }
  });
  yPosition = (doc as any).lastAutoTable.finalY + 6;

  doc.setFontSize(8);
  doc.text('Match Commissioner: _______________', 15, yPosition);
  yPosition += 5;
  doc.text('Match Won By: _____________________', 15, yPosition);

  doc.save(`${team1?.teamName}_vs_${team2?.teamName}_Teams.pdf`);
};


// Export match teams with players and photos as PDF
// export const exportMatchTeamsWithPlayersToPDF = async (
//   match: Match,
//   teams: Team[],
//   players: Player[],
//   eventName: string
// ) => {
//   const doc = new jsPDF();
  
//   const team1 = teams.find(t => t.id === match.team1Id);
//   const team2 = teams.find(t => t.id === match.team2Id);
//   const team1Players = players.filter(p => p.teamId === match.team1Id);
//   const team2Players = players.filter(p => p.teamId === match.team2Id);

//   // Title
//   doc.setFontSize(20);
//   doc.text(`${eventName} - Match Teams`, 20, 20);
  
//   doc.setFontSize(14);
//   doc.text(`${team1?.teamName} vs ${team2?.teamName}`, 20, 35);
  
//   if (match.date) {
//     doc.text(`Date: ${match.date}`, 20, 45);
//   }
//   if (match.time) {
//     doc.text(`Time: ${match.time}`, 120, 45);
//   }
//   if (match.venue) {
//     doc.text(`Venue: ${match.venue}`, 20, 55);
//   }

//   let yPosition = 70;

//   // Team 1
//   if (team1) {
//     doc.setFontSize(16);
//     doc.text(`${team1.teamName}`, 20, yPosition);
//     doc.setFontSize(12);
//     doc.text(`Coach: ${team1.coachName} | District: ${team1.district}`, 20, yPosition + 10);
//     yPosition += 25;

//     // Team 1 Players
//     for (const player of team1Players) {
//       if (yPosition > 250) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       // Player photo
//       if (player.photo) {
//         try {
//           const imageData = await loadImageAsBase64(player.photo);
//           if (imageData) {
//             doc.addImage(imageData, 'JPEG', 20, yPosition, 15, 15);
//           }
//         } catch (error) {
//           console.error('Error adding image:', error);
//         }
//       }

//       // Player details
//       doc.text(`#${player.jerseyNumber} ${player.name}`, 40, yPosition + 5);
//       doc.text(`${player.role} | DOB: ${player.dob}`, 40, yPosition + 12);
//       yPosition += 20;
//     }

//     yPosition += 15;
//   }

//   // Team 2
//   if (team2) {
//     if (yPosition > 200) {
//       doc.addPage();
//       yPosition = 20;
//     }

//     doc.setFontSize(16);
//     doc.text(`${team2.teamName}`, 20, yPosition);
//     doc.setFontSize(12);
//     doc.text(`Coach: ${team2.coachName} | District: ${team2.district}`, 20, yPosition + 10);
//     yPosition += 25;

//     // Team 2 Players
//     for (const player of team2Players) {
//       if (yPosition > 250) {
//         doc.addPage();
//         yPosition = 20;
//       }

//       // Player photo
//       if (player.photo) {
//         try {
//           const imageData = await loadImageAsBase64(player.photo);
//           if (imageData) {
//             doc.addImage(imageData, 'JPEG', 20, yPosition, 15, 15);
//           }
//         } catch (error) {
//           console.error('Error adding image:', error);
//         }
//       }

//       // Player details
//       doc.text(`#${player.jerseyNumber} ${player.name}`, 40, yPosition + 5);
//       doc.text(`${player.role} | DOB: ${player.dob}`, 40, yPosition + 12);
//       yPosition += 20;
//     }
//   }

//   doc.save(`${team1?.teamName}_vs_${team2?.teamName}_Teams.pdf`);
// };

// Export group teams to Excel
export const exportGroupTeamsToExcel = (
  group: Group,
  teams: Team[],
  players: Player[],
  eventName: string
) => {
  const wb = XLSX.utils.book_new();
  
  // Group summary
  const groupSummary = [{
    'Event': eventName,
    'Group': group.name,
    'Total Teams': group.teams.length,
    'Generated On': new Date().toLocaleDateString()
  }];
  
  const summaryWS = XLSX.utils.json_to_sheet(groupSummary);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

  // Teams in group
  const groupTeams = teams.filter(team => group.teams.includes(team.id));
  const teamsData = groupTeams.map(team => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    return {
      'Team Name': team.teamName,
      'Coach': team.coachName,
      'District': team.district,
      'Mobile': team.mobile,
      'Email': team.email,
      'Players Count': teamPlayers.length
    };
  });

  const teamsWS = XLSX.utils.json_to_sheet(teamsData);
  XLSX.utils.book_append_sheet(wb, teamsWS, 'Teams');

  // All players in group
  const allPlayersData: any[] = [];
  groupTeams.forEach(team => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    teamPlayers.forEach(player => {
      allPlayersData.push({
        'Team': team.teamName,
        'Jersey Number': player.jerseyNumber,
        'Player Name': player.name,
        'Father Name': player.fatherName,
        'Date of Birth': player.dob,
        'Age': new Date().getFullYear() - new Date(player.dob).getFullYear(),
        'Role': player.role,
        'Gender': player.sex,
        'School/College': player.schoolCollege,
        'District': player.district,
        'Address': player.address,
        'Email': player.email,
        'Mobile': player.mobile,
        'IRBF No': player.irbfNo,
        'Photo URL': player.photo || 'No photo',
        'Aadhar': player.aadhar || '',
        'Aadhar Certificate': player.aadharCertificate || '',
        'Birth Certificate': player.birthCertificate || '',
        'IRBF Certificate': player.irbfCertificate || ''
      });
    });
  });

  const playersWS = XLSX.utils.json_to_sheet(allPlayersData);
  XLSX.utils.book_append_sheet(wb, playersWS, 'All Players');

  XLSX.writeFile(wb, `${eventName}_${group.name}_Teams.xlsx`);
};

// Excel Export Functions
export const exportGroupsToExcel = (
  event: Event,
  groups: Group[],
  teams: Team[],
  matches: Match[]
) => {
  const wb = XLSX.utils.book_new();

  // Create groups worksheet
  const groupsData = groups.map(group => {
    const groupTeams = teams.filter(team => group.teams.includes(team.id));
    return {
      'Group Name': group.name,
      'Teams Count': groupTeams.length,
      'Teams': groupTeams.map(t => t.teamName).join(', ')
    };
  });

  const groupsWS = XLSX.utils.json_to_sheet(groupsData);
  XLSX.utils.book_append_sheet(wb, groupsWS, 'Groups');

  // Create detailed standings for each group
  groups.forEach(group => {
    const groupTeams = teams.filter(team => group.teams.includes(team.id));
    const groupMatches = matches.filter(match => match.groupId === group.id && match.result);

    const standings = groupTeams.map(team => {
      let wins = 0;
      let losses = 0;
      let setsWon = 0;
      let setsLost = 0;
      let matchesPlayed = 0;

      groupMatches.forEach(match => {
        if (match.team1Id === team.id || match.team2Id === team.id) {
          matchesPlayed++;
          if (match.result?.winnerId === team.id) {
            wins++;
          } else {
            losses++;
          }

          if (match.team1Id === team.id) {
            setsWon += match.result?.team1Sets || 0;
            setsLost += match.result?.team2Sets || 0;
          } else {
            setsWon += match.result?.team2Sets || 0;
            setsLost += match.result?.team1Sets || 0;
          }
        }
      });

      return {
        'Team Name': team.teamName,
        'Coach': team.coachName,
        'District': team.district,
        'Matches Played': matchesPlayed,
        'Wins': wins,
        'Losses': losses,
        'Points': wins * 2,
        'Sets Won': setsWon,
        'Sets Lost': setsLost,
        'Set Ratio': setsLost > 0 ? (setsWon / setsLost).toFixed(2) : setsWon.toString()
      };
    }).sort((a, b) => {
      if (b.Points !== a.Points) return b.Points - a.Points;
      return parseFloat(b['Set Ratio']) - parseFloat(a['Set Ratio']);
    });

    const standingsWS = XLSX.utils.json_to_sheet(standings);
    XLSX.utils.book_append_sheet(wb, standingsWS, group.name);
  });

  XLSX.writeFile(wb, `${event.name}_Groups.xlsx`);
};

export const exportMatchesToExcel = (
  event: Event,
  matches: Match[],
  teams: Team[],
  groups: Group[]
) => {
  const wb = XLSX.utils.book_new();

  // All matches
  const matchesData = matches.map(match => {
    const team1 = teams.find(t => t.id === match.team1Id);
    const team2 = teams.find(t => t.id === match.team2Id);
    const group = groups.find(g => g.id === match.groupId);
    const winner = match.result ? teams.find(t => t.id === match?.result?.winnerId) : null;

    return {
      'Group': group?.name || 'N/A',
      'Team 1': team1?.teamName || 'Unknown',
      'Team 2': team2?.teamName || 'Unknown',
      'Date': match.date || 'TBD',
      'Time': match.time || 'TBD',
      'Venue': match.venue || 'TBD',
      'Stage': match.stage,
      'Team 1 Sets': match.result?.team1Sets || '-',
      'Team 2 Sets': match.result?.team2Sets || '-',
      'Winner': winner?.teamName || 'TBD',
      'Status': match.result ? 'Completed' : 'Scheduled'
    };
  });

  const matchesWS = XLSX.utils.json_to_sheet(matchesData);
  XLSX.utils.book_append_sheet(wb, matchesWS, 'All Matches');

  // Group by stage
  const stages = ['group', 'quarterfinal', 'semifinal', 'final'];
  stages.forEach(stage => {
    const stageMatches = matchesData.filter(match => match.Stage === stage);
    if (stageMatches.length > 0) {
      const stageWS = XLSX.utils.json_to_sheet(stageMatches);
      XLSX.utils.book_append_sheet(wb, stageWS, stage.charAt(0).toUpperCase() + stage.slice(1));
    }
  });

  XLSX.writeFile(wb, `${event.name}_Matches.xlsx`);
};

export const exportResultsToExcel = (
  event: Event,
  teams: Team[],
  players: Player[],
  groups: Group[],
  matches: Match[]
) => {
  const wb = XLSX.utils.book_new();

  // Tournament summary
  const summary = [{
    'Tournament': event.name,
    'Category': event.category,
    'Gender': event.gender,
    'Start Date': event.startDate,
    'End Date': event.endDate,
    'Total Teams': teams.length,
    'Total Players': players.length,
    'Total Groups': groups.length,
    'Total Matches': matches.length,
    'Completed Matches': matches.filter(m => m.result).length
  }];

  const summaryWS = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

  // Teams data
  const teamsData = teams.map(team => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    return {
      'Team Name': team.teamName,
      'Coach': team.coachName,
      'District': team.district,
      'Mobile': team.mobile,
      'Email': team.email,
      'Players Count': teamPlayers.length,
      'Group': groups.find(g => g.teams.includes(team.id))?.name || 'Not Assigned'
    };
  });

  const teamsWS = XLSX.utils.json_to_sheet(teamsData);
  XLSX.utils.book_append_sheet(wb, teamsWS, 'Teams');

  // Players data
  const playersData = players.map(player => {
    const team = teams.find(t => t.id === player.teamId);
    return {
      'Team': team?.teamName || 'Unknown',
      'Player Name': player.name,
      'Date of Birth': player.dob,
      'Role': player.role,
      'Jersey Number': player.jerseyNumber,
      'Age': new Date().getFullYear() - new Date(player.dob).getFullYear()
    };
  });

  const playersWS = XLSX.utils.json_to_sheet(playersData);
  XLSX.utils.book_append_sheet(wb, playersWS, 'Players');

  XLSX.writeFile(wb, `${event.name}_Results.xlsx`);
};

// // PDF Export Functions
export const exportGroupsToPDF = (
  event: Event,
  groups: Group[],
  teams: Team[],
) => {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 255);
  doc.text(event.name, 105, 15, { align: "center" });
  doc.text(`Roll Ball Championship 2025-2026`, 105, 22, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(0, 128, 0);
  doc.text(`Date: ${event.startDate} to ${event.endDate}`, 20, 32);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Venue: _________`, 100, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Organised by    : Sports Tamil Nadu Roll Ball Association`, 20, 39);
  // doc.text(`Conducted by   : Thanjavur District Roll Ball Student Association`, 20, 45);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 255);
  doc.text(`POOL DETAILS - ${event.gender}`, 105, 55, { align: "center" });

  // Ensure at least 4 groups for columns
  const groupNames = groups.map(g => g.name);
  while (groupNames.length < 4) groupNames.push(`Group ${groupNames.length + 1}`);
  const groupTeamsList = groups.map(group =>
    teams.filter(team => group.teams.includes(team.id)).map(team => team.district)
  );
  while (groupTeamsList.length < 4) groupTeamsList.push([]);

  // Find max rows needed
  const maxRows = Math.max(...groupTeamsList.map(list => list.length));

  // Build table data: each row contains districts for each group
  const tableBody: string[][] = [];
  for (let i = 0; i < maxRows; i++) {
    tableBody.push(groupTeamsList.map(list => list[i] || ""));
  }

  autoTable(doc, {
    startY: 60,
    head: [[
      { content: groupNames[0], styles: { textColor: [0, 0, 255], fontStyle: 'bold', halign: 'center' } },
      { content: groupNames[1], styles: { textColor: [0, 128, 0], fontStyle: 'bold', halign: 'center' } },
      { content: groupNames[2], styles: { textColor: [255, 0, 0], fontStyle: 'bold', halign: 'center' } },
      { content: groupNames[3], styles: { textColor: [128, 0, 128], fontStyle: 'bold', halign: 'center' } }
    ]],
    body: tableBody.map(row => [
      { content: row[0] || "", styles: { textColor: [0, 0, 255], halign: 'center' } },
      { content: row[1] || "", styles: { textColor: [0, 128, 0], halign: 'center' } },
      { content: row[2] || "", styles: { textColor: [255, 0, 0], halign: 'center' } },
      { content: row[3] || "", styles: { textColor: [128, 0, 128], halign: 'center' } }
    ]),
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    margin: { left: 20, right: 20 }
  });

  doc.save(`${event.name}_Groups.pdf`);
};

// export const exportGroupsToPDF = (
//   event: Event,
//   groups: Group[],
//   teams: Team[],
//   matches: Match[]
// ) => {
//   const doc = new jsPDF("p", "mm", "a4");

//   // Title
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(16);
//   doc.setTextColor(0, 0, 255);
//   doc.text(event.name, 105, 15, { align: "center" });
//   doc.text(`Roll Ball Championship 2025-2026`, 105, 22, { align: "center" });

//   // Date & Venue
//   doc.setFontSize(11);
//   doc.setTextColor(0, 128, 0);
//   doc.text(`Date: ${event.startDate} to ${event.endDate}`, 20, 32);

//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "bold");
//   doc.text(`Venue: __________ `, 100, 32);

//   // Organisers
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);
//   doc.text(`Organised by    : Sports Tamil Nadu Roll Ball Association`, 20, 39);
//   // doc.text(`Conducted by   : Thanjavur District Roll Ball Student Association`, 20, 45);

//   // Pool details title
//   doc.setFontSize(13);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0, 0, 255);
//   doc.text(`POOL DETAILS - ${event.gender}`, 105, 55, { align: "center" });

//   // Get teams by pool
//   const pools = ["Pool A", "Pool B", "Pool C", "Pool D"];
//   const poolTeams = pools.map(poolName => {
//     const group = groups.find(g => g.name === poolName);
//     return group
//       ? teams.filter(t => group.teams.includes(t.id)).map(t => t.teamName)
//       : [];
//   });

//   // Find max rows
//   const maxRows = Math.max(...poolTeams.map(p => p.length));

//   // Pad with empty strings for equal rows
//   const tableData = [];
//   for (let i = 0; i < maxRows; i++) {
//     tableData.push([
//       poolTeams[0][i] || "",
//       poolTeams[1][i] || "",
//       poolTeams[2][i] || "",
//       poolTeams[3][i] || ""
//     ]);
//   }

//   // Build header with colors
//   const headRow = [
//     { content: "Pool A", styles: { halign: 'center', textColor: [0, 0, 255], fontStyle: 'bold' } },
//     { content: "Pool B", styles: { halign: 'center', textColor: [0, 128, 0], fontStyle: 'bold' } },
//     { content: "Pool C", styles: { halign: 'center', textColor: [0, 0, 255], fontStyle: 'bold' } },
//     { content: "Pool D", styles: { halign: 'center', textColor: [255, 0, 0], fontStyle: 'bold' } }
//   ];

//   // Apply colors to each team column
//   const bodyRows = tableData.map(row => [
//     { content: row[0], styles: { textColor: [0, 0, 255] } },
//     { content: row[1], styles: { textColor: [0, 128, 0] } },
//     { content: row[2], styles: { textColor: [0, 0, 255] } },
//     { content: row[3], styles: { textColor: [255, 0, 0] } }
//   ]);

//   // Table
//   autoTable(doc, {
//     startY: 60,
//     head: [headRow],
//     body: bodyRows,
//     theme: "grid",
//     styles: { fontSize: 11, halign: 'center', valign: 'middle' },
//     headStyles: {
//       fillColor: [255, 255, 255],
//       lineColor: [0, 0, 0],
//       lineWidth: 0.2
//     },
//     bodyStyles: {
//       fillColor: [255, 255, 255],
//       lineColor: [0, 0, 0],
//       lineWidth: 0.2
//     },
//     tableLineColor: [0, 0, 0],
//     tableLineWidth: 0.2
//   });

//   doc.save("Pool_Details.pdf");
// };


// export const exportMatchesToPDF = (
//   event: Event,
//   matches: Match[],
//   teams: Team[],
//   groups: Group[]
// ) => {
//   const doc = new jsPDF();
  
//   // Title
//   doc.setFontSize(20);
//   doc.text(`${event.name} - Match Results`, 20, 20);
  
//   doc.setFontSize(12);
//   doc.text(`Category: ${event.category} | Gender: ${event.gender}`, 20, 30);
//   doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);

//   const matchesData = matches.map(match => {
//     const team1 = teams.find(t => t.id === match.team1Id);
//     const team2 = teams.find(t => t.id === match.team2Id);
//     const group = groups.find(g => g.id === match.groupId);
//     const winner = match.result ? teams.find(t => t.id === match.result.winnerId) : null;

//     return [
//       group?.name || 'N/A',
//       team1?.teamName || 'Unknown',
//       team2?.teamName || 'Unknown',
//       match.date || 'TBD',
//       match.result ? `${match.result.team1Sets}-${match.result.team2Sets}` : 'TBD',
//       winner?.teamName || 'TBD',
//       match.result ? 'Completed' : 'Scheduled'
//     ];
//   });

//   autoTable(doc, {
//     startY: 60,
//     head: [['Group', 'Team 1', 'Team 2', 'Date', 'Score', 'Winner', 'Status']],
//     body: matchesData,
//     theme: 'grid',
//     headStyles: { fillColor: [66, 139, 202] },
//     margin: { left: 10, right: 10 },
//     styles: { fontSize: 8 }
//   });

//   doc.save(`${event.name}_Matches.pdf`);
// };

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

export const exportMatchesToPDF  = (
  event: Event,
  matches: Match[],
  teams: Team[],
  groups: Group[]
)  => {
  const doc = new jsPDF("p", "mm", "a4");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 255);
  doc.text(event.name, 105, 15, { align: "center" });
  doc.text(`Roll Ball Championship 2025-2026`, 105, 22, { align: "center" });

  // Date & Venue
  doc.setFontSize(11);
  doc.setTextColor(0, 128, 0);
  doc.text(`Date: ${event.startDate} to ${event.endDate}`, 20, 32);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Venue:_______`, 100, 32);

  // Organisers
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Organised by    : Sports Tamil Nadu Roll Ball Association`, 20, 39);
  // doc.text(`Conducted by   : Thanjavur District Roll Ball Student Association`, 20, 45);

  // Match Schedule Title
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 255);
  doc.text(`MATCH SCHEDULE – ${event.gender} (Date: 19.07.2025)`, 105, 55, { align: "center" });

  // Prepare match data
  const matchesData = matches.map((match, index) => {
    const team1 = teams.find(t => t.id === match.team1Id)?.teamName || '';
    const team2 = teams.find(t => t.id === match.team2Id)?.teamName || '';
    const pool = groups.find(g => g.id === match.groupId)?.name || '';
    const court = ''; // Placeholder for court
    const score = ''; // Placeholder for score
    const result =''; // Placeholder for result

    return [
      { content: `${index + 1}.`, styles: { halign: 'center', fontStyle: 'bold', textColor: [0, 0, 255] } },
      { content: `${team1} Vs ${team2}`, styles: { textColor: [0, 0, 255] } },
      { content: pool, styles: { halign: 'center' } },
      { content: court, styles: { halign: 'center', textColor: [255, 0, 0] } },
      { content: score, styles: { halign: 'center', textColor: [255, 0, 0] } },
      { content: result, styles: { halign: 'center', textColor: [255, 0, 0] } },
    ];
  });

  // Table
  autoTable(doc, {
    startY: 60,
    head: [[
      { content: "Sl.No.", styles: { halign: 'center' } },
      { content: "DISTRICT", styles: { halign: 'center', textColor: [0, 0, 255], fontStyle: 'bold' } },
      { content: "POOL", styles: { halign: 'center' } },
      { content: "COURT", styles: { halign: 'center', textColor: [255, 0, 0], fontStyle: 'bold' } },
      { content: "SCORE", styles: { halign: 'center', textColor: [255, 0, 0], fontStyle: 'bold' } },
      { content: "RESULT", styles: { halign: 'center', textColor: [255, 0, 0], fontStyle: 'bold' } }
    ]],
    body: matchesData,
    theme: "grid",
    styles: {
      fontSize: 11,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.2,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.2,
      lineColor: [0, 0, 0]
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2
  });

  doc.save("Match_Schedule.pdf");
};


export const exportResultsToPDF = (
  event: Event,
  teams: Team[],
  players: Player[],
  groups: Group[],
  matches: Match[]
) => {
  const doc = new jsPDF();
  
  // Title page
  doc.setFontSize(24);
  doc.text(`${event.name}`, 20, 30);
  doc.setFontSize(18);
  doc.text('Tournament Results', 20, 45);
  
  doc.setFontSize(12);
  doc.text(`Category: ${event.category}`, 20, 65);
  doc.text(`Gender: ${event.gender}`, 20, 75);
  doc.text(`Duration: ${event.startDate} to ${event.endDate}`, 20, 85);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 95);

  // Statistics
  const completedMatches = matches.filter(m => m.result).length;
  doc.text('Tournament Statistics:', 20, 115);
  doc.text(`Total Teams: ${teams.length}`, 30, 125);
  doc.text(`Total Players: ${players.length}`, 30, 135);
  doc.text(`Total Groups: ${groups.length}`, 30, 145);
  doc.text(`Total Matches: ${matches.length}`, 30, 155);
  doc.text(`Completed Matches: ${completedMatches}`, 30, 165);
  doc.text(`Completion Rate: ${((completedMatches / matches.length) * 100).toFixed(1)}%`, 30, 175);

  // Teams summary
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Participating Teams', 20, 20);

  const teamsData = teams.map(team => [
    team.teamName,
    team.coachName,
    team.district,
    players.filter(p => p.teamId === team.id).length.toString(),
    groups.find(g => g.teams.includes(team.id))?.name || 'Not Assigned'
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Team Name', 'Coach', 'District', 'Players', 'Group']],
    body: teamsData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    margin: { left: 10, right: 10 }
  });

  doc.save(`${event.name}_Results.pdf`);
};