import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Team, Player } from '../types';

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

export const exportTeamToPDF = async (team: Team, players: Player[]) => {
  const doc = new jsPDF();
  
  // Page 1: Team Overview with Player Grid



  // === HEADER ===
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 0, 0);
  doc.text("12th Tamilnadu State Mini Under - 11", 105, 15, { align: "center" });
  doc.text("Roll Ball Championship 2025-2026", 105, 23, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text("Date: 18, 19, 20 / July / 2025  Venue: Anna Stadium, Thanjavur", 105, 30, { align: "center" });
  doc.text("Org.by: Sports Tamilnadu Roll Ball Association", 105, 35, { align: "center" });
  doc.text("Conducted by: Thanjavur District Student Roll Ball Association", 105, 40, { align: "center" });

  // === District Name Box ===
  doc.setDrawColor(0, 150, 255);
  doc.setLineWidth(0.5);
  doc.rect(15, 50, 55, 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Name of the District", 17, 55);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 0, 0);
  doc.text(team.district.toUpperCase(), 50, 55);

  // === TEAM PHOTO ENTRY box ===
  // doc.setDrawColor(0, 150, 255);
  // doc.rect(75, 50, 60, 8);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TEAM PHOTO ENTRY", 85, 55);

  // === BOYS/GIRLS checkboxes ===
  doc.rect(140, 50, 20, 8);
  doc.text("BOYS", 142, 55);
  doc.rect(160, 50, 20, 8);
  doc.text("GIRLS", 162, 55);
  if (players[0].sex === "female") {
    doc.setTextColor(255, 0, 0);
    doc.text("YES", 180, 55);
  } else {
    doc.setTextColor(255, 0, 0);
    doc.text("YES", 152, 55);
  }
  doc.setTextColor(0, 0, 0);

  // === Player Grid (4 columns × 3 rows) ===
  const startX = 15;
  const startY = 65;
  const photoW = 38;
  const photoH = 35;
  const boxH = 45; // includes text area
  const cols = 4;
  const rows = 3;

  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (photoW + 5);
    const y = startY + row * (boxH + 5);

    // Outer box
    doc.setDrawColor(0, 150, 255);
    doc.rect(x, y, photoW, photoH);

    // Player photo
    if (players[i] && players[i].photo) {
      try {
        const imgData = await loadImageAsBase64(players[i].photo!);
        doc.addImage(imgData, "JPEG", x, y, photoW, photoH);
      } catch {
        // leave blank if failed
      }
    }

    // Name & DOB area
    doc.setDrawColor(0, 150, 100);
    doc.rect(x, y + photoH, photoW, 10);
    doc.setFontSize(8);
    doc.setTextColor(0, 100, 0);
    if (players[i]) {
      doc.text(`Name: ${players[i].name}`, x + 1, y + photoH + 4);
      doc.text(`D.O.B: ${players[i].dob}`, x + 1, y + photoH + 8);
    } else {
      doc.text(`Name:`, x + 1, y + photoH + 4);
      doc.text(`D.O.B:`, x + 1, y + photoH + 8);
    }
  }

  // === Coaches and Logo at Bottom ===
  let bottomY = 225;
  const coachW = 30;
  const coachH = 30;

  // Coach 1
  // Coach 1
  doc.rect(15, bottomY, coachW, coachH);
  doc.setFontSize(8);
  doc.text("Affix Coach Photo", 17, bottomY + 10);
  doc.text("Coach Name:", 15, bottomY + 38);
  doc.text(".......................................", 15, bottomY + 42);

  // Coach 2
  doc.rect(50, bottomY, coachW, coachH);
  doc.text("Affix Coach Photo", 52, bottomY + 10);
  doc.text("Coach Name:", 52, bottomY + 38);
  doc.text("......................................." ,52, bottomY + 42);

  // Academy Logo
  doc.rect(90, bottomY, coachW, coachH);
  doc.text("Affix Academy Logo", 92, bottomY + 10);

  // Seal & Sign Box
  doc.setDrawColor(0, 150, 255);
  doc.rect(130, bottomY, 50, coachH);
  doc.setTextColor(0, 100, 0);
  doc.text("District Association Seal & Sign", 132, bottomY + coachH / 2);


  
  // Page 2: Players Table

  doc.addPage();

  // ===== HEADER =====
  doc.setFontSize(18);
  doc.setTextColor(200, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("12th Tamilnadu State Mini Under - 11", 105, 15, { align: "center" });
  doc.text("Roll Ball Championship 2025-2026", 105, 23, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Date: 18, 19, 20 / July / 2025   Venue: Anna Stadium, Thanjavur",
    105,
    30,
    { align: "center" }
  );
  doc.text(
    "Org. by: Sports Tamilnadu Roll Ball Association",
    105,
    35,
    { align: "center" }
  );
  doc.text(
    "Conducted by: Thanjavur District Student Roll Ball Association",
    105,
    40,
    { align: "center" }
  );

  // ===== DISTRICT AND TEAM ENTRY =====

  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Name of the District:", 15, 50);
  doc.setFont("helvetica", "normal");
  doc.text(team.district || "__________", 65, 50);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 0, 0);
  doc.text("TEAM ENTRY", 105, 50, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.text("BOYS [ ]  GIRLS []", 160, 50);

  // ===== TABLE =====
  const tableData = players.map((player, index) => [
    index + 1,
    player.name,
    player.jerseyNumber || "",
    player.dob,
    "", // Signature blank
    player.irbfNo || ""
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["S.No", "Name of Players", "Jersey No.", "D.O.B", "Signature", "IRBF No."]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "center", cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { halign: "center", cellWidth: 25 }
    }
  });

 // ===== UNDERTAKING =====
  let y = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 102, 204);
  doc.text("Undertaking", 15, y);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  const undertakingText =
    "The above mentioned Player are regular player of our District and their Date of Birth and information or true in accordance with the general Register verified by us. We undertake to abide by the rules and regulations of the championship. We know and understand that the decisions of the technical committee / jury of appeal shall bind my team. We, further undertake that my team wish to participate in this Tamil Nadu State Roll Ball Championship 2025-2026 (Boys & Girls) at our own risk and will not claim any compensation for any injury sustained due to any accident during the Championship against the Organizers or State/District Association.";
  doc.text(undertakingText, 15, y + 5, { maxWidth: 180 });

  // ===== PLACE / DATE =====
  bottomY = y + 30;
  doc.setFontSize(10);
  doc.text("Place ............................", 15, bottomY);
  doc.text("Date ............................", 150, bottomY);

  // ===== SIGNATURE SECTION =====
  bottomY += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 102, 204);
  doc.text("Signature of District Secretary with Seal", 15, bottomY);
  doc.text("Round Seal", 90, bottomY);
  doc.text("Signature of Team Manager/Coach", 150, bottomY);

  // ===== NAME & MOBILE =====
  bottomY += 10;
  doc.setTextColor(0, 0, 0);
  doc.text(`Name:  ........................`, 15, bottomY);
  doc.text(`Name: ${team.coachName || "........................"}`, 150, bottomY);

  bottomY += 8;
  doc.text(`Mob. No:  ........................`, 15, bottomY);
  doc.setTextColor(200, 0, 0);
  doc.text(`${team.mobile || "........................"}`, 150, bottomY);

  // ===== NOTES =====
  bottomY += 12;
  doc.setFontSize(7);
  doc.setTextColor(0, 102, 204);
  doc.text(
    "Note: 1) Write player's Full Name in Capital Letter  2) Incomplete forms will not be accepted  3) Every team should bring two passport size photographs that must be attached to the form  4) Attested copy of birth certificate also must be attached to the form  5) School bonafide certificate must be attached with the form",
    15,
    bottomY,
    { maxWidth: 180 }
  );
  doc.setTextColor(0, 0, 0);

  
  
  // Individual Player Pages
  for (const player of players) {

    doc.addPage();

  // ===== HEADER =====
  doc.setFillColor(0, 174, 239); // blue background
  doc.rect(0, 0, 210, 45, "F");

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("12th Tamilnadu State Mini Under - 11", 105, 15, { align: "center" });
  doc.text("Roll Ball Championship 2025-2026", 105, 23, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Date: 18, 19, 20 / July / 2025   Venue: Anna Stadium, Thanjavur",
    105,
    30,
    { align: "center" }
  );
  doc.text(
    "Org. by: Sports Tamilnadu Roll Ball Association",
    105,
    35,
    { align: "center" }
  );
  doc.text(
    "Conducted by: Thanjavur District Student Roll Ball Association",
    105,
    40,
    { align: "center" }
  );

  // ===== FORM TITLE =====
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(0, 102, 204);
  doc.rect(60, 47, 90, 8, "F");
  doc.text("INDIVIDUAL ENTRY FORM", 105, 53, { align: "center" });

  // ===== FORM FIELDS =====
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let y = 65;

  // Left column X: 15, Right column X: 110
  const leftX = 15;
  const rightX = 110;
  const labelWidth = 50;
  const valueWidth = 45;

  // Row 1: Name
  doc.setFont("helvetica", "bold");
  doc.text("Name (in Block Letters):", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.name || ""}`, leftX + labelWidth, y);

  // Row 2: Father's Name
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Father's Name:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.fatherName || ""}`, leftX + labelWidth, y);

  // Row 3: Address
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Address:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.address || ""}`, leftX + labelWidth, y);

  // Row 4: Email Id (left), IRBF ID No. (right)
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Email Id:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.email || ""}`, leftX + labelWidth, y);

  doc.setFont("helvetica", "bold");
  doc.text("IRBF ID No.:", rightX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.irbfNo || ""}`, rightX + labelWidth, y);

  // Row 5: Mobile (left), Sex (right)
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Mobile:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.mobile || ""}`, leftX + labelWidth, y);

  doc.setFont("helvetica", "bold");
  doc.text("Sex:", rightX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.sex || "Male / Female"}`, rightX + labelWidth, y);

  // Row 6: Date of Birth (left), School/College (right)
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Date of Birth:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.dob || ""}`, leftX + labelWidth, y);

  doc.setFont("helvetica", "bold");
  doc.text("School/College:", rightX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${player.schoolCollege || ""}`, rightX + labelWidth, y);

  // Row 7: District (full width)
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Name of the District:", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${team.district || ""}`, leftX + labelWidth, y);

  // ===== PHOTO BOX =====
  doc.rect(160, 60, 35, 35);
  doc.setFontSize(8);
  doc.text("Affix Passport Size", 162, 75);
  doc.text("Photo", 172, 80);

  if (player.photo) {
    try {
      const imageData = await loadImageAsBase64(player.photo!);
      doc.addImage(imageData, "JPEG", 160, 60, 35, 35);
    } catch (err) {
      console.error("Photo load error", err);
    }
  }

  // ===== UNDERTAKING =====
  y += 20;
  const undertaking =
    "I / my ward shall take part in the above mentioned championship at my / my ward’s own risk and shall not hold organizers for any injury and/or loss to me / my ward during the championship. I understand that I / my ward are / is liable to disqualify, if found guilty of making wrong statement.\nNote: Two copies of 3 cm x 3 cm size photographs must be attached to the form. Attested copy of Birth Certificate (Compulsory)";
  doc.setFontSize(8);
  doc.text(undertaking, 15, y, { maxWidth: 180 });

  // ===== SIGNATURES =====
  y += 30;
  doc.setFontSize(10);
  doc.setTextColor(0, 102, 204);
  doc.text("Signature of Player", 15, y);
  doc.text("Signature of Parent", 150, y);
  y += 20;
  doc.text("Signature of Coach", 15, y);
  doc.text("Signature of District Secretary", 150, y);
  doc.text("With Seal", 150, y + 5);

  // SAVE PDF


  }
  
  // Save the PDF
  doc.save(`${team.teamName}_Complete_Details.pdf`);
};