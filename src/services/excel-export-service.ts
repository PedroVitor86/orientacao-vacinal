import ExcelJS from 'exceljs';
import { getAllSubmissions, getAnalytics, SubmissionRecord } from './submission-service';

function formatBool(val: any, notApplicable = false): string {
  if (notApplicable) return 'Não se aplica';
  if (val === true) return 'Sim';
  if (val === false) return 'Não';
  return 'Não';
}

function formatTreatmentStatus(checked?: boolean, statusVal?: string): string {
  if (!checked) return 'Não se aplica';
  if (!statusVal) return 'Não informado';
  if (statusVal === 'PREGRESSO') return 'Pregresso';
  if (statusVal === 'ATUAL') return 'Atual';
  if (statusVal === 'EM_PLANEJAMENTO') return 'Em planejamento';
  return String(statusVal);
}

function formatUnit(val?: string): string {
  if (val === 'DUMAS' || val === 'PFIZER') return 'Dumas';
  if (val === 'ITAPEVI') return 'Itapevi';
  if (val === 'FORCA_DE_VENDAS') return 'Força de Vendas';
  return val || 'Não informado';
}

function applyHeaderStyle(row: ExcelJS.Row, bgArgb = 'FF1F1545') {
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgArgb },
    };
    cell.font = {
      name: 'Arial',
      size: 10,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF3B2D6E' } },
      left: { style: 'thin', color: { argb: 'FF3B2D6E' } },
      bottom: { style: 'medium', color: { argb: 'FF7B28E2' } },
      right: { style: 'thin', color: { argb: 'FF3B2D6E' } },
    };
  });
  row.height = 28;
}

function applyDataStyle(row: ExcelJS.Row, isEven = false) {
  const bg = isEven ? 'FFF9F9FC' : 'FFFFFFFF';
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bg },
    };
    cell.font = { name: 'Arial', size: 9.5 };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };
  });
  row.height = 22;
}

export async function generateExcelWorkbook(affiliationFilter?: string): Promise<Buffer> {
  const records = await getAllSubmissions(affiliationFilter);
  const analytics = await getAnalytics(affiliationFilter);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TRIVAX • Plataforma de Orientação Vacinal';
  workbook.lastModifiedBy = 'TRIVAX';
  workbook.created = new Date();
  workbook.modified = new Date();

  // ==========================================
  // ABA 1: PAINEL DE INDICADORES & RESUMO
  // ==========================================
  const wsIndicadores = workbook.addWorksheet('1. Indicadores & Resumo', {
    views: [{ showGridLines: true }],
  });

  wsIndicadores.columns = [
    { width: 32 },
    { width: 18 },
    { width: 18 },
    { width: 32 },
    { width: 18 },
    { width: 18 },
  ];

  // Título
  wsIndicadores.mergeCells('A1:F1');
  const titleCell = wsIndicadores.getCell('A1');
  titleCell.value = 'TRIVAX • RELATÓRIO EXECUTIVO POPULACIONAL';
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF120E24' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsIndicadores.getRow(1).height = 36;

  // Subtítulo
  wsIndicadores.mergeCells('A2:F2');
  const subCell = wsIndicadores.getCell('A2');
  const filterLabel =
    affiliationFilter === 'DUMAS' || affiliationFilter === 'PFIZER'
      ? 'Dumas'
      : affiliationFilter === 'ITAPEVI'
      ? 'Itapevi'
      : affiliationFilter === 'FORCA_DE_VENDAS'
      ? 'Força de Vendas'
      : 'Todas as Unidades';
  subCell.value = `Exportado em: ${new Date().toLocaleString('pt-BR')} | Filtro de Unidade: ${filterLabel}`;
  subCell.font = { name: 'Arial', size: 9.5, italic: true, color: { argb: 'FFAAB0C6' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F1545' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  wsIndicadores.getRow(2).height = 20;

  // Bloco 1: Totais Gerais
  wsIndicadores.getCell('A4').value = 'Métrica';
  wsIndicadores.getCell('B4').value = 'Total';
  wsIndicadores.getCell('C4').value = '%';
  wsIndicadores.getCell('D4').value = 'Métrica';
  wsIndicadores.getCell('E4').value = 'Total';
  wsIndicadores.getCell('F4').value = '%';
  applyHeaderStyle(wsIndicadores.getRow(4), 'FF2B1C58');

  const total = analytics.totalRespondents || 1;

  wsIndicadores.addRow(['Total de Avaliações', analytics.totalRespondents, '100%', 'Elegíveis COVID-19', analytics.vaccineStats.COVID_19.count, `${analytics.vaccineStats.COVID_19.percentage}%`]);
  wsIndicadores.addRow(['Colaboradores Dumas', analytics.byAffiliation.dumas, `${Math.round((analytics.byAffiliation.dumas / total) * 100)}%`, 'Elegíveis VSR', analytics.vaccineStats.VSR.count, `${analytics.vaccineStats.VSR.percentage}%`]);
  wsIndicadores.addRow(['Colaboradores Itapevi', analytics.byAffiliation.itapevi, `${Math.round((analytics.byAffiliation.itapevi / total) * 100)}%`, 'Elegíveis Pneumocócica 20', analytics.vaccineStats.PNEUMO_20.count, `${analytics.vaccineStats.PNEUMO_20.percentage}%`]);
  wsIndicadores.addRow(['Força de Vendas', analytics.byAffiliation.forcaVendas, `${Math.round((analytics.byAffiliation.forcaVendas / total) * 100)}%`, '-', '-', '-']);

  for (let r = 5; r <= 8; r++) {
    applyDataStyle(wsIndicadores.getRow(r), r % 2 === 0);
  }

  // Bloco 2: Faixa Etária e Sexo
  wsIndicadores.getCell('A10').value = 'Faixa Etária';
  wsIndicadores.getCell('B10').value = 'Total';
  wsIndicadores.getCell('C10').value = '%';
  wsIndicadores.getCell('D10').value = 'Distribuição por Sexo';
  wsIndicadores.getCell('E10').value = 'Total';
  wsIndicadores.getCell('F10').value = '%';
  applyHeaderStyle(wsIndicadores.getRow(10), 'FF2B1C58');

  wsIndicadores.addRow(['18 a 49 anos', analytics.byAgeBracket['18_49'] ?? 0, `${Math.round(((analytics.byAgeBracket['18_49'] ?? 0) / total) * 100)}%`, 'Feminino (Mulheres)', analytics.bySex?.feminino ?? 0, `${analytics.bySex?.femininoPercentage ?? 0}%`]);
  wsIndicadores.addRow(['50 a 59 anos', analytics.byAgeBracket['50_59'] ?? 0, `${Math.round(((analytics.byAgeBracket['50_59'] ?? 0) / total) * 100)}%`, 'Masculino (Homens)', analytics.bySex?.masculino ?? 0, `${analytics.bySex?.masculinoPercentage ?? 0}%`]);
  wsIndicadores.addRow(['60 a 74 anos', analytics.byAgeBracket['60_74'] ?? 0, `${Math.round(((analytics.byAgeBracket['60_74'] ?? 0) / total) * 100)}%`, 'Não informado', analytics.bySex?.naoInformar ?? 0, `${analytics.bySex?.naoInformarPercentage ?? 0}%`]);
  wsIndicadores.addRow(['75 anos ou mais', analytics.byAgeBracket['75_plus'] ?? 0, `${Math.round(((analytics.byAgeBracket['75_plus'] ?? 0) / total) * 100)}%`, '-', '-', '-']);

  for (let r = 11; r <= 14; r++) {
    applyDataStyle(wsIndicadores.getRow(r), r % 2 === 0);
  }

  // Bloco 3: Conscientização
  wsIndicadores.getCell('A16').value = 'Indicador de Conscientização ("Você sabia que estava elegível?")';
  wsIndicadores.getCell('B16').value = 'Respostas';
  wsIndicadores.getCell('C16').value = '% do Feedback';
  wsIndicadores.mergeCells('A16:A16');
  applyHeaderStyle(wsIndicadores.getRow(16), 'FF7B28E2');

  wsIndicadores.addRow(['Sim, já sabia de todas', analytics.awarenessStats.sim, `${analytics.awarenessStats.simPercentage}%`]);
  wsIndicadores.addRow(['Não sabia de nenhuma', analytics.awarenessStats.nao, `${analytics.awarenessStats.naoPercentage}%`]);
  wsIndicadores.addRow(['Sabia de algumas', analytics.awarenessStats.parcial, `${analytics.awarenessStats.parcialPercentage}%`]);
  wsIndicadores.addRow(['Total de Pessoas que Responderam ao Feedback', analytics.awarenessStats.totalResponses, '100%']);

  for (let r = 17; r <= 20; r++) {
    applyDataStyle(wsIndicadores.getRow(r), r % 2 === 0);
  }

  // ==========================================
  // ABA 2: BASE GERAL COMPLETA (Todas as Colunas)
  // ==========================================
  const wsGeral = workbook.addWorksheet('2. Base Geral Completa', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1, showGridLines: true }],
  });

  const colGeral = [
    { header: 'ID da Avaliação', key: 'id', width: 16 },
    { header: 'Data e Hora', key: 'timestamp', width: 18 },
    { header: 'Unidade / Vínculo', key: 'unit', width: 18 },
    { header: 'Faixa Etária', key: 'age_bracket', width: 16 },
    { header: 'Sexo', key: 'sex', width: 14 },
    { header: 'Gestante', key: 'pregnant', width: 12 },
    { header: 'Gestante 32-36s', key: 'pregnant_weeks', width: 16 },
    { header: 'Puérpera (45d)', key: 'postpartum', width: 16 },
    { header: 'Trabalhador da Saúde', key: 'health_worker', width: 20 },
    { header: 'Tabagismo Ativo', key: 'smoker', width: 16 },
    { header: 'Alcoolismo', key: 'alcoholism', width: 14 },
    { header: 'Fragilidade / Neurológica', key: 'frailty', width: 22 },
    { header: 'Asma Moderada a Grave', key: 'asthma', width: 22 },
    { header: 'DPOC / Doença Pulmonar', key: 'copd', width: 22 },
    { header: 'Insuficiência Cardíaca', key: 'heart_failure', width: 20 },
    { header: 'Doença Coronariana', key: 'coronary', width: 20 },
    { header: 'Diabetes Mellitus', key: 'diabetes', width: 18 },
    { header: 'Doença Renal Crônica', key: 'kidney', width: 20 },
    { header: 'Doença Hepática Crônica', key: 'liver', width: 22 },
    { header: 'Obesidade Grau 3 (IMC≥40)', key: 'obesity', width: 24 },
    { header: 'Imunossupressão / Câncer', key: 'cancer', width: 24 },
    { header: 'Uso de Imunossupressores', key: 'uses_immuno', width: 24 },
    { header: 'Status Imunossupressores', key: 'status_immuno', width: 22 },
    { header: 'Quimioterapia', key: 'is_chemo', width: 16 },
    { header: 'Status Quimioterapia', key: 'status_chemo', width: 20 },
    { header: 'Radioterapia', key: 'is_radio', width: 16 },
    { header: 'Status Radioterapia', key: 'status_radio', width: 20 },
    { header: 'Asplenia (Baço)', key: 'asplenia', width: 16 },
    { header: 'Implante Coclear', key: 'cochlear', width: 16 },
    { header: 'Fístula Liquórica', key: 'csf', width: 16 },
    { header: 'COVID-19 Indicada?', key: 'covid_res', width: 18 },
    { header: 'Motivos COVID-19', key: 'covid_reasons', width: 35 },
    { header: 'VSR Indicada?', key: 'vsr_res', width: 16 },
    { header: 'Motivos VSR', key: 'vsr_reasons', width: 35 },
    { header: 'Pneumo 20 Indicada?', key: 'pneumo_res', width: 20 },
    { header: 'Motivos Pneumo 20', key: 'pneumo_reasons', width: 35 },
    { header: 'Total Vacinas', key: 'total_vaccines', width: 14 },
    { header: 'Sabia da Elegibilidade?', key: 'awareness', width: 22 },
  ];

  wsGeral.columns = colGeral;
  applyHeaderStyle(wsGeral.getRow(1), 'FF1F1545');

  records.forEach((r, idx) => {
    const facts = r.facts || {};
    const isFemale = r.sex === 'FEMININO';
    const row = wsGeral.addRow({
      id: r.id,
      timestamp: new Date(r.timestamp).toLocaleString('pt-BR'),
      unit: formatUnit(r.user_affiliation),
      age_bracket: r.age_bracket === '18_49' ? '18 a 49 anos' : r.age_bracket === '50_59' ? '50 a 59 anos' : r.age_bracket === '60_74' ? '60 a 74 anos' : '75 anos ou mais',
      sex: r.sex === 'FEMININO' ? 'Feminino' : r.sex === 'MASCULINO' ? 'Masculino' : 'Não informado',
      pregnant: formatBool(facts.is_pregnant, !isFemale),
      pregnant_weeks: formatBool(facts.pregnancy_weeks_32_36, !isFemale || !facts.is_pregnant),
      postpartum: formatBool(facts.is_postpartum, !isFemale),
      health_worker: formatBool(facts.is_health_worker),
      smoker: formatBool(facts.is_smoker),
      alcoholism: formatBool(facts.has_alcoholism),
      frailty: formatBool(facts.has_clinical_frailty),
      asthma: formatBool(facts.has_asthma),
      copd: formatBool(facts.has_copd),
      heart_failure: formatBool(facts.has_heart_failure),
      coronary: formatBool(facts.has_coronary_disease),
      diabetes: formatBool(facts.has_diabetes),
      kidney: formatBool(facts.has_chronic_kidney_disease),
      liver: formatBool(facts.has_chronic_liver_disease),
      obesity: formatBool(facts.has_morbid_obesity_bmi_40),
      cancer: formatBool(facts.has_cancer || facts.has_immunosuppression),
      uses_immuno: formatBool(facts.uses_immunosuppressants),
      status_immuno: formatTreatmentStatus(facts.uses_immunosuppressants, facts.status_immunosuppressants),
      is_chemo: formatBool(facts.is_chemotherapy),
      status_chemo: formatTreatmentStatus(facts.is_chemotherapy, facts.status_chemotherapy),
      is_radio: formatBool(facts.is_radiotherapy),
      status_radio: formatTreatmentStatus(facts.is_radiotherapy, facts.status_radiotherapy),
      asplenia: formatBool(facts.has_asplenia),
      cochlear: formatBool(facts.has_cochlear_implant),
      csf: formatBool(facts.has_csf_leak),
      covid_res: r.eligible_vaccines.includes('COVID_19') ? 'Sim' : 'Não',
      covid_reasons: (r.reasons_by_vaccine?.COVID_19 || []).join(' | ') || 'Nenhum critério',
      vsr_res: r.eligible_vaccines.includes('VSR') ? 'Sim' : 'Não',
      vsr_reasons: (r.reasons_by_vaccine?.VSR || []).join(' | ') || 'Nenhum critério',
      pneumo_res: r.eligible_vaccines.includes('PNEUMO_20') ? 'Sim' : 'Não',
      pneumo_reasons: (r.reasons_by_vaccine?.PNEUMO_20 || []).join(' | ') || 'Nenhum critério',
      total_vaccines: r.eligible_vaccines.length,
      awareness: r.awareness_feedback === 'SIM' ? 'Sim, já sabia' : r.awareness_feedback === 'NAO' ? 'Não sabia' : r.awareness_feedback === 'PARCIAL' ? 'Sabia de algumas' : 'Não respondeu',
    });
    applyDataStyle(row, idx % 2 === 0);
  });

  // ==========================================
  // ABA 3: RESULTADOS CLÍNICOS E VACINAS
  // ==========================================
  const wsVacinas = workbook.addWorksheet('3. Resultados & Vacinas', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1, showGridLines: true }],
  });

  wsVacinas.columns = [
    { header: 'ID da Avaliação', key: 'id', width: 16 },
    { header: 'Data e Hora', key: 'timestamp', width: 18 },
    { header: 'Unidade', key: 'unit', width: 16 },
    { header: 'Faixa Etária', key: 'age_bracket', width: 16 },
    { header: 'Sexo', key: 'sex', width: 14 },
    { header: 'COVID-19 Indicada?', key: 'covid_res', width: 18 },
    { header: 'Motivos COVID-19', key: 'covid_reasons', width: 40 },
    { header: 'VSR Indicada?', key: 'vsr_res', width: 16 },
    { header: 'Motivos VSR', key: 'vsr_reasons', width: 40 },
    { header: 'Pneumo 20 Indicada?', key: 'pneumo_res', width: 20 },
    { header: 'Motivos Pneumo 20', key: 'pneumo_reasons', width: 40 },
    { header: 'Total Indicadas', key: 'total_vaccines', width: 16 },
    { header: 'Sabia da Elegibilidade?', key: 'awareness', width: 24 },
  ];
  applyHeaderStyle(wsVacinas.getRow(1), 'FF2B1C58');

  records.forEach((r, idx) => {
    const row = wsVacinas.addRow({
      id: r.id,
      timestamp: new Date(r.timestamp).toLocaleString('pt-BR'),
      unit: formatUnit(r.user_affiliation),
      age_bracket: r.age_bracket === '18_49' ? '18 a 49 anos' : r.age_bracket === '50_59' ? '50 a 59 anos' : r.age_bracket === '60_74' ? '60 a 74 anos' : '75 anos ou mais',
      sex: r.sex === 'FEMININO' ? 'Feminino' : r.sex === 'MASCULINO' ? 'Masculino' : 'Não informado',
      covid_res: r.eligible_vaccines.includes('COVID_19') ? 'Sim' : 'Não',
      covid_reasons: (r.reasons_by_vaccine?.COVID_19 || []).join(' | ') || 'Nenhum critério prioritário',
      vsr_res: r.eligible_vaccines.includes('VSR') ? 'Sim' : 'Não',
      vsr_reasons: (r.reasons_by_vaccine?.VSR || []).join(' | ') || 'Nenhum critério prioritário',
      pneumo_res: r.eligible_vaccines.includes('PNEUMO_20') ? 'Sim' : 'Não',
      pneumo_reasons: (r.reasons_by_vaccine?.PNEUMO_20 || []).join(' | ') || 'Nenhum critério prioritário',
      total_vaccines: r.eligible_vaccines.length,
      awareness: r.awareness_feedback === 'SIM' ? 'Sim, já sabia' : r.awareness_feedback === 'NAO' ? 'Não sabia' : r.awareness_feedback === 'PARCIAL' ? 'Sabia de algumas' : 'Não respondeu',
    });
    applyDataStyle(row, idx % 2 === 0);
  });

  // ==========================================
  // ABA 4: PERFIL & HÁBITOS DE VIDA
  // ==========================================
  const wsPerfil = workbook.addWorksheet('4. Perfil & Hábitos', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1, showGridLines: true }],
  });

  wsPerfil.columns = [
    { header: 'ID da Avaliação', key: 'id', width: 16 },
    { header: 'Data e Hora', key: 'timestamp', width: 18 },
    { header: 'Unidade', key: 'unit', width: 16 },
    { header: 'Faixa Etária', key: 'age_bracket', width: 16 },
    { header: 'Sexo', key: 'sex', width: 14 },
    { header: 'Gestante', key: 'pregnant', width: 14 },
    { header: 'Gestante ≥24 sem', key: 'pregnant_weeks', width: 18 },
    { header: 'Puérpera (45d)', key: 'postpartum', width: 16 },
    { header: 'Trabalhador da Saúde', key: 'health_worker', width: 22 },
    { header: 'Tabagismo Ativo', key: 'smoker', width: 16 },
    { header: 'Alcoolismo', key: 'alcoholism', width: 14 },
    { header: 'Fragilidade / Neurológica', key: 'frailty', width: 24 },
  ];
  applyHeaderStyle(wsPerfil.getRow(1), 'FF1F1545');

  records.forEach((r, idx) => {
    const facts = r.facts || {};
    const isFemale = r.sex === 'FEMININO';
    const row = wsPerfil.addRow({
      id: r.id,
      timestamp: new Date(r.timestamp).toLocaleString('pt-BR'),
      unit: formatUnit(r.user_affiliation),
      age_bracket: r.age_bracket === '18_49' ? '18 a 49 anos' : r.age_bracket === '50_59' ? '50 a 59 anos' : r.age_bracket === '60_74' ? '60 a 74 anos' : '75 anos ou mais',
      sex: r.sex === 'FEMININO' ? 'Feminino' : r.sex === 'MASCULINO' ? 'Masculino' : 'Não informado',
      pregnant: formatBool(facts.is_pregnant, !isFemale),
      pregnant_weeks: formatBool(facts.pregnancy_weeks_32_36, !isFemale || !facts.is_pregnant),
      postpartum: formatBool(facts.is_postpartum, !isFemale),
      health_worker: formatBool(facts.is_health_worker),
      smoker: formatBool(facts.is_smoker),
      alcoholism: formatBool(facts.has_alcoholism),
      frailty: formatBool(facts.has_clinical_frailty),
    });
    applyDataStyle(row, idx % 2 === 0);
  });

  // ==========================================
  // ABA 5: CONDIÇÕES CLÍNICAS & RISCO
  // ==========================================
  const wsCondicoes = workbook.addWorksheet('5. Condições Clínicas', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1, showGridLines: true }],
  });

  wsCondicoes.columns = [
    { header: 'ID da Avaliação', key: 'id', width: 16 },
    { header: 'Data e Hora', key: 'timestamp', width: 18 },
    { header: 'Unidade', key: 'unit', width: 16 },
    { header: 'Asma Moderada/Grave', key: 'asthma', width: 20 },
    { header: 'DPOC / Pulmonar', key: 'copd', width: 18 },
    { header: 'Insuficiência Cardíaca', key: 'heart_failure', width: 20 },
    { header: 'Doença Coronariana', key: 'coronary', width: 20 },
    { header: 'Diabetes Mellitus', key: 'diabetes', width: 18 },
    { header: 'Doença Renal Crônica', key: 'kidney', width: 20 },
    { header: 'Doença Hepática Crônica', key: 'liver', width: 22 },
    { header: 'Obesidade Grau 3 (IMC≥40)', key: 'obesity', width: 24 },
    { header: 'Imunossupressão / Câncer', key: 'cancer', width: 24 },
    { header: 'Uso de Imunossupressores', key: 'uses_immuno', width: 24 },
    { header: 'Status Imunossupressores', key: 'status_immuno', width: 22 },
    { header: 'Quimioterapia', key: 'is_chemo', width: 16 },
    { header: 'Status Quimioterapia', key: 'status_chemo', width: 20 },
    { header: 'Radioterapia', key: 'is_radio', width: 16 },
    { header: 'Status Radioterapia', key: 'status_radio', width: 20 },
    { header: 'Asplenia (Baço)', key: 'asplenia', width: 16 },
    { header: 'Implante Coclear', key: 'cochlear', width: 16 },
    { header: 'Fístula Liquórica', key: 'csf', width: 16 },
  ];
  applyHeaderStyle(wsCondicoes.getRow(1), 'FF2B1C58');

  records.forEach((r, idx) => {
    const facts = r.facts || {};
    const row = wsCondicoes.addRow({
      id: r.id,
      timestamp: new Date(r.timestamp).toLocaleString('pt-BR'),
      unit: formatUnit(r.user_affiliation),
      asthma: formatBool(facts.has_asthma),
      copd: formatBool(facts.has_copd),
      heart_failure: formatBool(facts.has_heart_failure),
      coronary: formatBool(facts.has_coronary_disease),
      diabetes: formatBool(facts.has_diabetes),
      kidney: formatBool(facts.has_chronic_kidney_disease),
      liver: formatBool(facts.has_chronic_liver_disease),
      obesity: formatBool(facts.has_morbid_obesity_bmi_40),
      cancer: formatBool(facts.has_cancer || facts.has_immunosuppression),
      uses_immuno: formatBool(facts.uses_immunosuppressants),
      status_immuno: formatTreatmentStatus(facts.uses_immunosuppressants, facts.status_immunosuppressants),
      is_chemo: formatBool(facts.is_chemotherapy),
      status_chemo: formatTreatmentStatus(facts.is_chemotherapy, facts.status_chemotherapy),
      is_radio: formatBool(facts.is_radiotherapy),
      status_radio: formatTreatmentStatus(facts.is_radiotherapy, facts.status_radiotherapy),
      asplenia: formatBool(facts.has_asplenia),
      cochlear: formatBool(facts.has_cochlear_implant),
      csf: formatBool(facts.has_csf_leak),
    });
    applyDataStyle(row, idx % 2 === 0);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
