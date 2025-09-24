function randomize(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function gradeCalculator(formFields) {
  let grade = 1;

  if (formFields.documento?.value === "Sim") {
    grade += 1;
  }

  if (formFields.Judicial?.value === "Sim") {
    grade += 1;
  }

  switch (formFields.processo?.value) {
    case "6 meses":
      grade += 1;
      break;
    case "3 meses":
      grade += 2;
      break;
    case "0 à 60 dias ":
      grade += 3;
      break;
  }

  return grade;
}

function getAnswers(formFields) {
  let info = "";

  if (formFields.documento?.value !== undefined) {
    info += `${formFields.documento.title} ${formFields.documento.value}, `;
  }
  if (formFields.Judicial?.value !== undefined) {
    info += `${formFields.Judicial.title} ${formFields.Judicial.value}, `;
  }
  if (formFields.interesse?.value !== undefined) {
    info += `${formFields.interesse.title} ${formFields.interesse.value}, `;
  }
  if (formFields.processo?.value !== undefined) {
    info += `${formFields.processo.title} ${formFields.processo.value}, `;
  }

  return info;
}

export const helpers = {
  randomize,
  gradeCalculator,
  getAnswers,
};

// {
//   nome: '431241',
//   contato: 423141323,
//   grauDeParentesco: '423141',
//   possuiDocumento: '314341',
//   conheceAViaJudicial: '3424',
//   quantasPessoasTemInteresse: '352',
//   quandoPretendeIniciar: 'Q352252',
//   null: '5235'
// }
// {
//   quandoPretendeIniciar: 'Em 6+ meses',
//   quantasPessoasTemInteresse: '5 à 7',
//   possuiDocumento: 'Não',
//   nome: 'Teste Nome cmpleto',
//   grauDeParentesco: 'Outros',
//   conheceAViaJudicial: 'Sim',
//   contato: 139999999,
//   chat_id: '3E6B18829AC9704F90FEF6D7C2AECF1E-29bdc8e8-a18f-4abe-b74f-4de14793b8a0',
//   contact_name: '',
//   contact_phone: '',
//   contact_email: '',
//   contact_gender: '',
//   contact_birthday: '',
//   contact_job_title: '',
//   contact_org_name: '',
//   contact_org_state: '',
//   contact_org_city: '',
//   whatsappPhone: '',
//   whatsappName: '',
//   contextId: '3E6B18829AC9704F90FEF6D7C2AECF1E-29bdc8e8-a18f-4abe-b74f-4de14793b8a0'
