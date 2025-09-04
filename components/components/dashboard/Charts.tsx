import React from "react";
import UserLocationPieChart from "./UserLocationPieChart";
import AppointmentsByDepartment from "./AppointmentsByDepartment";
// import RespondersByFaciliityBarChart from "./RespondersByFaciliityBarChart";

const Charts = ({
  appintmentsByDepartment = [],
  usersByDistrict = [],
}: {
  usersByDistrict: any[];
  appintmentsByDepartment: any[];
}) => {
  return (
    <div className="mt-4 w-full flex flex-row gap-2">
      <AppointmentsByDepartment
        data={appintmentsByDepartment}
        text="Appontments by department"
      />
      <UserLocationPieChart data={usersByDistrict} />
    </div>
  );
};

export default Charts;