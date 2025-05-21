export const routeName = (detector) => {
    const routes = {
      AGM: "agmindividual",
      "AP4C-F": "AP4CIndividual",
      FCAD: "FCADIndividual",
      PRM: "PRMIndividual",
      VRM: "vrmIndividual",
      IBAC: "ibacIndividual",
      MAB: "MABIndividual",
      AAM: "aamIndividual",
      WRM: "wrmIndividual",
      "Oxygen Monitor": "OxygenMonitoring",
    };
    return routes[detector] || null;
  };