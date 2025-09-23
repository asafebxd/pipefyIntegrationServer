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
