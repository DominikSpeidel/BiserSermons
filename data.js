// Kirchenjahresrad — Daten aller Lesejahre
//
// Vier liturgische Farben:
//   christmas → Weihnachtsfestkreis (Advent + Weihnachten):  Violett   #6B2D8B
//   easter    → Osterfestkreis (Fastenzeit + Osterzeit):     Creme     #FFF8E1
//   ordinary  → Zeit im Jahreskreis:                         Grün      #2D7A2D
//   festtag   → Kirchliche Feiertage:                        Gold      #D4AF37
//
// url: YouTube-Link zur Predigt, oder "" wenn noch nicht hinterlegt

const SEASON_COLORS = {
  christmas: { fill: '#6B2D8B', stroke: '#4A1A63', label: 'Weihnachtszeit' },
  easter:    { fill: '#FFF8E1', stroke: '#C8A400', label: 'Osterzeit'       },
  ordinary:  { fill: '#2D7A2D', stroke: '#1B5E20', label: 'Jahreskreis'     },
  festtag:   { fill: '#D4AF37', stroke: '#8B6914', label: 'Festtag'         },
};

const KIRCHENJAHR = {

  // ═══════════════════════════════════════════════════════════════════════════
  // LESEJAHR A — 2025/2026
  // 1. Advent 2025 (30.11.2025) — Christkönigssonntag 2026 (22.11.2026)
  // ═══════════════════════════════════════════════════════════════════════════
  A: {
    id: 'A',
    title: 'Lesejahr A',
    yearRange: '2025/2026',
    days: [
      // ── WEIHNACHTSFESTKREIS  30.11.2025 – 11.01.2026 ─
      { date: '2025-11-30', label: '1. Adventssonntag',                                season: 'christmas', url: '' },
      { date: '2025-12-07', label: '2. Adventssonntag',                                season: 'christmas', url: '' },
      { date: '2025-12-14', label: '3. Adventssonntag (Gaudete)',                       season: 'christmas', url: '' },
      { date: '2025-12-21', label: '4. Adventssonntag',                                season: 'christmas', url: '' },
      { date: '2025-12-24', label: 'Heiliger Abend',                                   season: 'festtag',   url: '' },
      { date: '2025-12-25', label: '1. Weihnachtsfeiertag',                            season: 'festtag',   url: '' },
      { date: '2025-12-28', label: 'Fest der Heiligen Familie',                        season: 'christmas', url: '' },
      { date: '2026-01-06', label: 'Erscheinung des Herrn (Heilige Drei Könige)',      season: 'festtag',   url: '' },
      { date: '2026-01-11', label: 'Taufe des Herrn',                                  season: 'christmas', url: '' },

      // ── JAHRESKREIS I  12.01.2026 – 17.02.2026 ─
      { date: '2026-01-18', label: '2. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=kfxbz8J9Q5w', predigtDate: '1990-01-14', lesung: 'Joh 1,29–34' },
      { date: '2026-01-25', label: '3. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=obL3sKpb6sg', predigtDate: '1996-01-21', lesung: 'Mt 12,23' },
      { date: '2026-02-01', label: '4. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=w8OjcmyT3FM', predigtDate: '1996-01-28', lesung: 'Mt 5,1–12' },
      { date: '2026-02-08', label: '5. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=h97BIZE18IY', predigtDate: '1999-02-07', lesung: 'Mt 5,13–16' },
      { date: '2026-02-15', label: '6. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=4ccSFr8xCpY', predigtDate: '1999-02-14', lesung: 'Mt 5,17–39' },

      // ── OSTERFESTKREIS  18.02.2026 – 24.05.2026 ─
      { date: '2026-02-22', label: '1. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=jElGukxLgAA', predigtDate: '2002-02-17', lesung: 'Mt 4,1–11' },
      { date: '2026-03-01', label: '2. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=kLnek78SpEE', lesung: 'Mt 17,1–9' },
      { date: '2026-03-08', label: '3. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=JfZZ-kSDQDo', lesung: 'Joh 4,5–42' },
      { date: '2026-03-15', label: '4. Fastensonntag (Laetare)',                       season: 'easter',    url: 'https://www.youtube.com/watch?v=M2XiJzeYGNM', predigtDate: '2002-03-10', lesung: 'Joh 9,1–41' },
      { date: '2026-03-22', label: '5. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=1wzCPAQn1yw', predigtDate: '1999-03-21', lesung: 'Joh 11,1–45' },
      { date: '2026-03-29', label: 'Palmsonntag',                                      season: 'easter',    url: 'https://www.youtube.com/watch?v=DO5q6kDHOrM', predigtDate: '2000-04-16', lesung: 'Mt 21,1–11' },
      { date: '2026-04-03', label: 'Karfreitag',                                       season: 'festtag',   url: '' },
      { date: '2026-04-05', label: 'Ostersonntag',                                     season: 'festtag',   url: 'https://www.youtube.com/watch?v=lXPGhWdvnbI', predigtDate: '2006-04-16', lesung: 'Joh 9,1–41' },
      { date: '2026-04-06', label: 'Ostermontag',                                      season: 'festtag',   url: '' },
      { date: '2026-04-12', label: '2. Ostersonntag',          season: 'easter',    url: 'https://www.youtube.com/watch?v=GUNbZRV5cvE', predigtDate: '1996-04-14', lesung: 'Joh 20,19–31' },
      { date: '2026-04-19', label: '3. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=bv2WVoZZVX0', predigtDate: '2005-04-10', lesung: 'Joh 21,1–14' },
      { date: '2026-04-26', label: '4. Ostersonntag',       season: 'easter',    url: 'https://www.youtube.com/watch?v=49eWcqhiJpg', predigtDate: '1990-05-06', lesung: 'Joh 10,1–10' },
      { date: '2026-05-03', label: '5. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=-ifVfwfPbMo', predigtDate: '1990-05-13', lesung: 'Joh 14,1–12' },
      { date: '2026-05-10', label: '6. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=ZE0VSI9BDlk', predigtDate: '1996-05-12', lesung: 'Joh 14,15–21' },
      { date: '2026-05-14', label: 'Christi Himmelfahrt',                              season: 'festtag',   url: '' },
      { date: '2026-05-17', label: '7. Ostersonntag',        season: 'easter',    url: 'https://www.youtube.com/watch?v=hhXAtAyyMwc', predigtDate: '1993-05-23', lesung: 'Joh 17,1–11' },
      { date: '2026-05-24', label: 'Pfingstsonntag',                                   season: 'festtag',   url: 'https://www.youtube.com/watch?v=MERjKZvU2NY', predigtDate: '1999-05-23', lesung: 'Joh 20,19–23' },

      // ── JAHRESKREIS II  25.05.2026 – 22.11.2026 ─
      { date: '2026-05-25', label: 'Pfingstmontag',                                    season: 'festtag',   url: '' },
      { date: '2026-05-31', label: 'Dreifaltigkeitssonntag',                           season: 'ordinary',  url: 'https://www.youtube.com/watch?v=SKbubEGCu-0', predigtDate: '1999-05-23', lesung: 'Joh 3,16–18' },
      { date: '2026-06-04', label: 'Fronleichnam',                                     season: 'festtag',   url: 'https://www.youtube.com/watch?v=Vb8bj5zxLTc', predigtDate: '1999-06-03', lesung: 'Joh 6,51–58' },
      { date: '2026-06-07', label: '11. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=hPb1k2O5vUE', predigtDate: '1999-06-17', lesung: 'Mt 9,36–10,8' },
      { date: '2026-06-14', label: '12. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=KpFUlF6htdc', predigtDate: '1999-06-20', lesung: 'Mt 10,26–33' },
      { date: '2026-06-21', label: '13. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=1XwM_-LpB2s', predigtDate: '1999-06-27', lesung: 'Mt 10,37–42' },
      { date: '2026-06-28', label: '14. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=yN3PT7w2uAU', predigtDate: '1999-07-01', lesung: 'Mt 11,25–30' },
      { date: '2026-07-05', label: '15. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=2gALfHy8mXw', predigtDate: '1999-07-11', lesung: 'Mt 13,1–23' },
      { date: '2026-07-12', label: '16. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=yBxDycCY1KU', predigtDate: '1999-07-18', lesung: 'Mt 13,24–30' },
      { date: '2026-07-19', label: '17. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=PtKMfwJm1bQ', predigtDate: '1999-07-25', lesung: 'Mt 13,44–52' },
      { date: '2026-07-26', label: '18. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=hSTPUg4TF7A', lesung: 'Mt 14,13–21' },
      { date: '2026-08-02', label: '19. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=PICK9ozr2Ic', predigtDate: '1999-08-08', lesung: 'Mt 14,22–33' },
      { date: '2026-08-09', label: '20. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=8AppklKrZZE', predigtDate: '1990-08-19', lesung: 'Mt 15,21–28' },
      { date: '2026-08-15', label: 'Mariä Himmelfahrt',                                season: 'festtag',   url: 'https://www.youtube.com/watch?v=oywT6PePSjQ', predigtDate: '2004-08-15', lesung: 'Lk 1,39–56' },
      { date: '2026-08-16', label: '21. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=H9fCgYU1Tro', predigtDate: '1999-08-22', lesung: 'Mt 16,13–20' },
      { date: '2026-08-23', label: '22. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=4UZYax2R1lU', predigtDate: '1990-09-02', lesung: 'Mt 16,21–27' },
      { date: '2026-08-30', label: '23. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=iS_ZOhlbWwY', predigtDate: '1999-09-05', lesung: 'Mt 18,15–20' },
      { date: '2026-09-06', label: '24. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=1FF5NlqXNZg', predigtDate: '1990-09-16', lesung: 'Mt 18,21–35' },
      { date: '2026-09-13', label: '25. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=P13rRGbuN-0', predigtDate: '1990-09-23', lesung: 'Mt 20,1–16a' },
      { date: '2026-09-20', label: '26. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=UVfydm20flY', predigtDate: '1990-09-30', lesung: 'Mt 21,28–32' },
      { date: '2026-09-27', label: '27. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=TZT16IiSA9s', predigtDate: '1990-10-07', lesung: 'Mt 21,33–44' },
      { date: '2026-10-04', label: '28. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=5mbwRWiPSwQ', predigtDate: '1990-10-14', lesung: 'Mt 22,1–14' },
      { date: '2026-10-11', label: '29. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=YqMny0obOqs', predigtDate: '1990-10-21', lesung: 'Mt 22,15–21' },
      { date: '2026-10-18', label: '30. Sonntag im Jahreskreis', season: 'ordinary',  url: 'https://www.youtube.com/watch?v=kaeySVFBWEw', predigtDate: '1990-10-28', lesung: 'Mt 22,34–40' },
      { date: '2026-10-25', label: '31. Sonntag im Jahreskreis',                       season: 'ordinary',  url: '' },
      { date: '2026-11-01', label: 'Allerheiligen',                                    season: 'festtag',   url: 'https://www.youtube.com/watch?v=lj5RMYUazhM', predigtDate: '1990-11-04', lesung: 'Mt 5,1–12' },
      { date: '2026-11-08', label: '32. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=RKh5AwyeuxM', predigtDate: '1990-11-11', lesung: 'Mt 25,1–13' },
      { date: '2026-11-15', label: '33. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=YsfuVgQQpp8', predigtDate: '1999-11-14', lesung: 'Mt 25,14–30' },
      { date: '2026-11-22', label: 'Christkönigssonntag',                              season: 'ordinary',  url: 'https://www.youtube.com/watch?v=1mGjUdF6WsA', predigtDate: '1996-11-24', lesung: 'Mt 25,31–46' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LESEJAHR B — 2026/2027
  // 1. Advent 2026 (29.11.2026) — Christkönigssonntag 2027 (21.11.2027)
  // ═══════════════════════════════════════════════════════════════════════════
  B: {
    id: 'B',
    title: 'Lesejahr B',
    yearRange: '2026/2027',
    days: [
      // ── WEIHNACHTSFESTKREIS  29.11.2026 – 10.01.2027 ─
      { date: '2026-11-29', label: '1. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=X8HKtDa_6zw', predigtDate: '2002-12-01', lesung: 'Mk 13,24–37' },
      { date: '2026-12-06', label: '2. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=ZNu3KS8JhS4', predigtDate: '2002-12-08', lesung: 'Mk 1,1–8' },
      { date: '2026-12-13', label: '3. Adventssonntag (Gaudete)',                       season: 'christmas', url: 'https://www.youtube.com/watch?v=u4QHNZO3Uic', predigtDate: '2002-12-15', lesung: 'Joh 1,6–8.19–28' },
      { date: '2026-12-20', label: '4. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=_HCO5_ueBuE', predigtDate: '2002-12-22', lesung: 'Lk 1,26–38' },
      { date: '2026-12-24', label: 'Heiliger Abend',                                   season: 'festtag',   url: '' },
      { date: '2026-12-25', label: '1. Weihnachtsfeiertag',                            season: 'festtag',   url: '' },
      { date: '2026-12-27', label: 'Fest der Heiligen Familie',                        season: 'christmas', url: '' },
      { date: '2027-01-06', label: 'Erscheinung des Herrn (Heilige Drei Könige)',      season: 'festtag',   url: 'https://www.youtube.com/watch?v=uAePkAnMF8o', predigtDate: '2006-01-06', lesung: 'Mt 2,1–12' },
      { date: '2027-01-10', label: 'Taufe des Herrn',                                  season: 'christmas', url: 'https://www.youtube.com/watch?v=9oBDyhIfBi4', predigtDate: '1997-01-12', lesung: 'Mk 1,7–11' },

      // ── JAHRESKREIS I  11.01.2027 – 09.02.2027 ─
      { date: '2027-01-17', label: '2. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=I5iGnTcV4Fw', predigtDate: '2000-01-16', lesung: 'Joh 1,35–42' },
      { date: '2027-01-24', label: '3. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=wp7hVDgEK0c', predigtDate: '1997-01-26', lesung: 'Mk 1,14–20' },
      { date: '2027-01-31', label: '4. Sonntag im Jahreskreis',                        season: 'ordinary',  url: '' },
      { date: '2027-02-07', label: '5. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=OYIe7qU6lJc', predigtDate: '2003-02-09', lesung: 'Mk 1,29–39' },

      // ── OSTERFESTKREIS  10.02.2027 – 16.05.2027 ─
      { date: '2027-02-14', label: '1. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=2pxcaMhHEx4', predigtDate: '1997-02-16', lesung: 'Mk 1,12–15' },
      { date: '2027-02-21', label: '2. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=NkONdHGklxk', predigtDate: '1997-02-23', lesung: 'Mk 9,2–10' },
      { date: '2027-02-28', label: '3. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=64bHmE46VcI', predigtDate: '1994-03-06', lesung: 'Joh 2,13–25' },
      { date: '2027-03-07', label: '4. Fastensonntag (Laetare)',                       season: 'easter',    url: 'https://www.youtube.com/watch?v=EatWulWnuGQ', predigtDate: '1997-03-09', lesung: 'Joh 3,14–21' },
      { date: '2027-03-14', label: '5. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=boFJZAhwWJk', predigtDate: '1997-03-16', lesung: 'Joh 12,20–33' },
      { date: '2027-03-21', label: 'Palmsonntag',                                      season: 'easter',    url: '' },
      { date: '2027-03-26', label: 'Karfreitag',                                       season: 'festtag',   url: '' },
      { date: '2027-03-28', label: 'Ostersonntag',                                     season: 'festtag',   url: 'https://www.youtube.com/watch?v=1yev_OVyjBY', lesung: 'Joh 20,1–18' },
      { date: '2027-03-29', label: 'Ostermontag',                                      season: 'festtag',   url: '' },
      { date: '2027-04-04', label: '2. Ostersonntag',          season: 'easter',    url: 'https://www.youtube.com/watch?v=4GyfGmUeNkI', lesung: 'Joh 20,19–31' },
      { date: '2027-04-11', label: '3. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=CXDFaSMRSXU', predigtDate: '2000-05-07', lesung: 'Lk 24,35–48' },
      { date: '2027-04-18', label: '4. Ostersonntag',       season: 'easter',    url: 'https://www.youtube.com/watch?v=9Xv1pidsHn8', lesung: 'Joh 10,11–18' },
      { date: '2027-04-25', label: '5. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=DC9-5LeDEpA', predigtDate: '2003-05-18', lesung: 'Joh 15,1–8' },
      { date: '2027-05-02', label: '6. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=xlByIXf3a8M', predigtDate: '2000-05-28', lesung: 'Joh 15,9–17' },
      { date: '2027-05-06', label: 'Christi Himmelfahrt',                              season: 'festtag',   url: 'https://www.youtube.com/watch?v=xgP2A82rN3o', predigtDate: '2000-05-21', lesung: 'Mk 16,15–20' },
      { date: '2027-05-09', label: '7. Ostersonntag',        season: 'easter',    url: 'https://www.youtube.com/watch?v=pIvDzvn-CHM', predigtDate: '2000-06-04', lesung: 'Joh 17,6a.11b–19' },
      { date: '2027-05-16', label: 'Pfingstsonntag',                                   season: 'festtag',   url: 'https://www.youtube.com/watch?v=MZ284r16quQ', predigtDate: '2000-06-11', lesung: 'Joh 20,19–23' },

      // ── JAHRESKREIS II  17.05.2027 – 21.11.2027 ─
      { date: '2027-05-17', label: 'Pfingstmontag',                                    season: 'festtag',   url: '' },
      { date: '2027-05-23', label: 'Dreifaltigkeitssonntag',                           season: 'ordinary',  url: 'https://www.youtube.com/watch?v=mqeHaPMUjTU', predigtDate: '1997-05-25', lesung: 'Mt 28,16–20' },
      { date: '2027-05-27', label: 'Fronleichnam',                                     season: 'festtag',   url: '' },
      { date: '2027-05-30', label: '9. Sonntag im Jahreskreis',                        season: 'ordinary',  url: '' },
      { date: '2027-06-06', label: '10. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Q5ulcQ8qVFk', predigtDate: '1994-06-05', lesung: 'Mk 3,20–35' },
      { date: '2027-06-13', label: '11. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=y01Ozr8YYQc', predigtDate: '1994-06-12', lesung: 'Mk 4,26–34' },
      { date: '2027-06-20', label: '12. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Z7CXyvAEc8Y', predigtDate: '2000-06-25', lesung: 'Mk 4,35–41' },
      { date: '2027-06-27', label: '13. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=-pCImieXGoo', predigtDate: '2000-07-02', lesung: 'Mk 5,21–43' },
      { date: '2027-07-04', label: '14. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=u2R5X5-AOlM', predigtDate: '2000-07-09', lesung: 'Mk 6,1b–6' },
      { date: '2027-07-11', label: '15. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=CP20QzJ_VF4', predigtDate: '1997-07-13', lesung: 'Mk 6,7–13' },
      { date: '2027-07-18', label: '16. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=QnUvlpj66s8', predigtDate: '1997-07-20', lesung: 'Mk 6,30–34' },
      { date: '2027-07-25', label: '17. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=GYZbJUvdT0Q', predigtDate: '2000-07-30', lesung: 'Joh 6,1–15' },
      { date: '2027-08-01', label: '18. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=nAU20XtQ-Es', predigtDate: '2003-08-03', lesung: 'Joh 6,24–35' },
      { date: '2027-08-08', label: '19. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Ii2Ywf9fr4g', predigtDate: '1997-08-10', lesung: 'Joh 6,41–51' },
      { date: '2027-08-15', label: 'Mariä Himmelfahrt',                                season: 'festtag',   url: 'https://www.youtube.com/watch?v=NyX_H-nuH1w', predigtDate: '2004-08-15', lesung: 'Lk 1,39–56' },
      { date: '2027-08-22', label: '21. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Nsi68455TRU', predigtDate: '1997-08-24', lesung: 'Joh 6,60–69' },
      { date: '2027-08-29', label: '22. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=CmTgnIm2WIo', predigtDate: '2003-08-31', lesung: 'Mk 7,1–8.14–15.21–23' },
      { date: '2027-09-05', label: '23. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Bo57TlGCsnI', predigtDate: '2000-09-10', lesung: 'Mk 7,31–37' },
      { date: '2027-09-12', label: '24. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=9QkaPijAxSU', predigtDate: '2000-09-17', lesung: 'Mk 8,27–35' },
      { date: '2027-09-19', label: '25. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=iq9HXx6YBgI', predigtDate: '2003-09-21', lesung: 'Mk 9,30–37' },
      { date: '2027-09-26', label: '26. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=p7JHwrsXH_A', predigtDate: '2003-09-28', lesung: 'Mk 9,38–43.45.47–48' },
      { date: '2027-10-03', label: '27. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=P0pgpJZAS5g', predigtDate: '2003-10-05', lesung: 'Mk 10,2–16' },
      { date: '2027-10-10', label: '28. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=-uyUYEsOyJo', predigtDate: '2000-10-15', lesung: 'Mk 10,17–30' },
      { date: '2027-10-17', label: '29. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=hpGq7NzLPHo', predigtDate: '1997-10-19', lesung: 'Mk 10,46–52' },
      { date: '2027-10-24', label: '30. Sonntag im Jahreskreis', season: 'ordinary',  url: 'https://www.youtube.com/watch?v=o_OjWLcQ-QY', predigtDate: '2003-10-26', lesung: 'Mk 10,46–52' },
      { date: '2027-10-31', label: '31. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=OJgquy_ircY', lesung: 'Mk 12,28b–34' },
      { date: '2027-11-01', label: 'Allerheiligen',                                    season: 'festtag',   url: '' },
      { date: '2027-11-07', label: '32. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=r91kbYVa0b8', predigtDate: '1982-11-07', lesung: 'Mk 12,38–44' },
      { date: '2027-11-14', label: '33. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=QxIIDslrlCI', predigtDate: '1994-11-13', lesung: 'Mk 13,24–32' },
      { date: '2027-11-21', label: 'Christkönigssonntag',                              season: 'ordinary',  url: 'https://www.youtube.com/watch?v=QwrMGfIR7-I', predigtDate: '2003-11-23', lesung: 'Joh 18,33b–37' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LESEJAHR C — 2027/2028
  // 1. Advent 2027 (28.11.2027) — Christkönigssonntag 2028 (26.11.2028)
  // ═══════════════════════════════════════════════════════════════════════════
  C: {
    id: 'C',
    title: 'Lesejahr C',
    yearRange: '2027/2028',
    days: [
      // ── WEIHNACHTSFESTKREIS  28.11.2027 – 09.01.2028 ─
      { date: '2027-11-28', label: '1. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=TiyK7xBCIz8', predigtDate: '2003-11-30', lesung: 'Lk 21,25–28.34–36' },
      { date: '2027-12-05', label: '2. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=ZH1mmuUKLYo', predigtDate: '2003-12-07', lesung: 'Lk 3,1–6' },
      { date: '2027-12-12', label: '3. Adventssonntag (Gaudete)',                       season: 'christmas', url: 'https://www.youtube.com/watch?v=aWR8YiIZ6zk', predigtDate: '2004-12-12', lesung: 'Lk 3,10–18' },
      { date: '2027-12-19', label: '4. Adventssonntag',                                season: 'christmas', url: 'https://www.youtube.com/watch?v=4q7JXRrkRTg', predigtDate: '2003-12-21', lesung: 'Lk 1,39–45' },
      { date: '2027-12-24', label: 'Heiliger Abend',                                   season: 'festtag',   url: '' },
      { date: '2027-12-25', label: '1. Weihnachtsfeiertag',                            season: 'festtag',   url: '' },
      { date: '2027-12-26', label: 'Fest der Heiligen Familie',                        season: 'christmas', url: '' },
      { date: '2028-01-06', label: 'Erscheinung des Herrn (Heilige Drei Könige)',      season: 'festtag',   url: 'https://www.youtube.com/watch?v=O5Q50u1WM20', predigtDate: '2004-01-06', lesung: 'Mt 2,1–12' },
      { date: '2028-01-09', label: 'Taufe des Herrn',                                  season: 'christmas', url: 'https://www.youtube.com/watch?v=HL00RHuAMUc', predigtDate: '1990-01-07', lesung: 'Mt 3,13–17' },

      // ── JAHRESKREIS I  10.01.2028 – 29.02.2028 ─
      { date: '2028-01-16', label: '2. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=7XmYdrhVMsw', predigtDate: '2004-01-18', lesung: 'Joh 2,1–11' },
      { date: '2028-01-23', label: '3. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=b_Jfh5pbMrs', predigtDate: '2004-01-25', lesung: 'Lk 1,1–4; 4,14–21' },
      { date: '2028-01-30', label: '4. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=gs-hI15KjUs', predigtDate: '2004-02-01', lesung: 'Lk 4,21–30' },
      { date: '2028-02-06', label: '5. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=wNlDSqJEbNM', predigtDate: '2004-02-08', lesung: 'Lk 5,1–11' },
      { date: '2028-02-13', label: '6. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=vKJXQSiQRZs', predigtDate: '2004-02-15', lesung: 'Lk 6,17.20–26' },
      { date: '2028-02-20', label: '7. Sonntag im Jahreskreis',                        season: 'ordinary',  url: 'https://www.youtube.com/watch?v=tetRFLGd2tc', predigtDate: '2004-02-22', lesung: 'Lk 6,27–38' },
      { date: '2028-02-27', label: '8. Sonntag im Jahreskreis',                        season: 'ordinary',  url: '' },

      // ── OSTERFESTKREIS  01.03.2028 – 04.06.2028 ─
      { date: '2028-03-05', label: '1. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=vtXDOP0ZT-o', predigtDate: '2004-02-29', lesung: 'Lk 4,1–13' },
      { date: '2028-03-12', label: '2. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=hI3LlQEYArs', predigtDate: '2004-03-07', lesung: 'Lk 9,28b–36' },
      { date: '2028-03-19', label: '3. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=rbQrza3sujI', predigtDate: '1994-03-06', lesung: 'Lk 13,1–9' },
      { date: '2028-03-26', label: '4. Fastensonntag (Laetare)',                       season: 'easter',    url: 'https://www.youtube.com/watch?v=SIv_gfnv6xE', predigtDate: '2004-03-21', lesung: 'Lk 15,1–3.11–32' },
      { date: '2028-04-02', label: '5. Fastensonntag',                                 season: 'easter',    url: 'https://www.youtube.com/watch?v=_H2PQwUXRww', predigtDate: '2001-04-01', lesung: 'Joh 8,1–11' },
      { date: '2028-04-09', label: 'Palmsonntag',                                      season: 'easter',    url: '' },
      { date: '2028-04-14', label: 'Karfreitag',                                       season: 'festtag',   url: '' },
      { date: '2028-04-16', label: 'Ostersonntag',                                     season: 'festtag',   url: 'https://www.youtube.com/watch?v=kQqrcQaGx0k', predigtDate: '2006-04-16', lesung: 'Joh 20,1–18' },
      { date: '2028-04-17', label: 'Ostermontag',                                      season: 'festtag',   url: '' },
      { date: '2028-04-23', label: '2. Ostersonntag',          season: 'easter',    url: 'https://www.youtube.com/watch?v=YlVmj4Q0tE8', predigtDate: '1996-04-14', lesung: 'Joh 20,19–31' },
      { date: '2028-04-30', label: '3. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=32IAL5YFHvI', predigtDate: '1995-04-30', lesung: 'Joh 21,1–19' },
      { date: '2028-05-07', label: '4. Ostersonntag',       season: 'easter',    url: 'https://www.youtube.com/watch?v=N2dW4QW1DQ8', predigtDate: '2004-05-02', lesung: 'Joh 10,27–30' },
      { date: '2028-05-14', label: '5. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=oIcDQIK2Tqc', predigtDate: '2004-05-09', lesung: 'Joh 13,31–33a.34–35' },
      { date: '2028-05-21', label: '6. Ostersonntag',                                  season: 'easter',    url: 'https://www.youtube.com/watch?v=MmLOcrEKRnA', predigtDate: '2004-05-16', lesung: 'Joh 14,23–29' },
      { date: '2028-05-25', label: 'Christi Himmelfahrt',                              season: 'festtag',   url: '' },
      { date: '2028-05-28', label: '7. Ostersonntag',        season: 'easter',    url: 'https://www.youtube.com/watch?v=EShxTo5Hd1g', predigtDate: '2004-05-23', lesung: 'Joh 17,20–26' },
      { date: '2028-06-04', label: 'Pfingstsonntag',                                   season: 'festtag',   url: 'https://www.youtube.com/watch?v=4K4VQMKuihc', predigtDate: '2004-05-30', lesung: 'Joh 20,19–23' },

      // ── JAHRESKREIS II  05.06.2028 – 26.11.2028 ─
      { date: '2028-06-05', label: 'Pfingstmontag',                                    season: 'festtag',   url: '' },
      { date: '2028-06-11', label: 'Dreifaltigkeitssonntag',                           season: 'ordinary',  url: '' },
      { date: '2028-06-15', label: 'Fronleichnam',                                     season: 'festtag',   url: '' },
      { date: '2028-06-18', label: '11. Sonntag im Jahreskreis',                       season: 'ordinary',  url: '' },
      { date: '2028-06-25', label: '12. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=T2dHNgUEGLs', predigtDate: '2004-06-20', lesung: 'Lk 9,18–24' },
      { date: '2028-07-02', label: '13. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=J_wfOuUYicE', predigtDate: '2004-06-27', lesung: 'Lk 9,51–62' },
      { date: '2028-07-09', label: '14. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=eWSWRpeXdbQ', predigtDate: '2004-07-04', lesung: 'Lk 10,1–12.17–20' },
      { date: '2028-07-16', label: '15. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=38TQAM5y5Pg', predigtDate: '2004-07-11', lesung: 'Lk 10,25–37' },
      { date: '2028-07-23', label: '16. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=R2gkZgA6JEA', predigtDate: '2004-07-18', lesung: 'Lk 10,38–42' },
      { date: '2028-07-30', label: '17. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=mjS2xh2Z_8s', predigtDate: '2004-07-25', lesung: 'Lk 11,1–13' },
      { date: '2028-08-06', label: '18. Sonntag im Jahreskreis',                       season: 'ordinary',  url: '' },
      { date: '2028-08-13', label: '19. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=E3CKT0piQ9Q', predigtDate: '2004-08-08', lesung: 'Lk 12,32–48' },
      { date: '2028-08-15', label: 'Mariä Himmelfahrt',                                season: 'festtag',   url: 'https://www.youtube.com/watch?v=u6lbsQEFSw4', predigtDate: '2004-08-15', lesung: 'Lk 1,39–56' },
      { date: '2028-08-20', label: '20. Sonntag im Jahreskreis',                       season: 'ordinary',  url: '' },
      { date: '2028-08-27', label: '21. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=VdIEinZRX1Y', predigtDate: '2004-08-22', lesung: 'Lk 13,22–30' },
      { date: '2028-09-03', label: '22. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=KCN_fn0nR04', predigtDate: '2004-08-28', lesung: 'Lk 14,1.7–14' },
      { date: '2028-09-10', label: '23. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=wk_JOPPEQWo', predigtDate: '2004-09-05', lesung: 'Lk 14,25–33' },
      { date: '2028-09-17', label: '24. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=x6BVNXiG0tc', predigtDate: '2004-09-12', lesung: 'Lk 15,1–3.11–32' },
      { date: '2028-09-24', label: '25. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=U9Zj78jQ2NA', predigtDate: '2004-09-19', lesung: 'Lk 16,1–10' },
      { date: '2028-10-01', label: '26. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=xZSeyMUzf4I', predigtDate: '2004-09-26', lesung: 'Lk 16,19–31' },
      { date: '2028-10-08', label: '27. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=41aES4LllRU', predigtDate: '2004-10-03', lesung: 'Lk 17,5–10' },
      { date: '2028-10-15', label: '28. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=pxDxVxmRptY', predigtDate: '2004-10-10', lesung: 'Lk 17,11–19' },
      { date: '2028-10-22', label: '29. Sonntag im Jahreskreis', season: 'ordinary',  url: 'https://www.youtube.com/watch?v=_iWYAxCfaYY', predigtDate: '2004-10-17', lesung: 'Lk 18,1–8' },
      { date: '2028-10-29', label: '30. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=YiSSsDoZWvk', predigtDate: '2004-10-24', lesung: 'Lk 18,9–14' },
      { date: '2028-11-01', label: 'Allerheiligen',                                    season: 'festtag',   url: '' },
      { date: '2028-11-05', label: '31. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=HAJFICn_mts', predigtDate: '2004-10-31', lesung: 'Lk 19,1–10' },
      { date: '2028-11-12', label: '32. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=Awka3886YWg', predigtDate: '2004-11-07', lesung: 'Lk 20,27–38' },
      { date: '2028-11-19', label: '33. Sonntag im Jahreskreis',                       season: 'ordinary',  url: 'https://www.youtube.com/watch?v=qMiEk_EduIE', predigtDate: '2004-11-14', lesung: 'Lk 21,5–19' },
      { date: '2028-11-26', label: 'Christkönigssonntag',                              season: 'ordinary',  url: 'https://www.youtube.com/watch?v=dD-3wc4uzMs', predigtDate: '2004-11-21', lesung: 'Lk 23,35–43' },
    ],
  },
};
