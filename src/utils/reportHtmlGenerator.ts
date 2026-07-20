export const generateMarkersTable = (markersData: any[]) => {
  if (!markersData || markersData.length === 0) return '';
  return `
    <table>
      <thead>
        <tr>
          <th>Marker</th>
          <th>Value</th>
          <th>Reference Range</th>
          <th>Status</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        ${markersData.map(category => `
          <tr><td colspan="5" style="background-color: #e9ecef; font-weight: bold;">${category.category}</td></tr>
          ${category.markers.map((marker: any) => `
            <tr>
              <td>${marker.name}</td>
              <td>${marker.value}</td>
              <td>${marker.referenceRange}</td>
              <td>${marker.status}</td>
              <td>${marker.comment}</td>
            </tr>
          `).join('')}
        `).join('')}
      </tbody>
    </table>
  `;
};

export const generateSupplementsTable = (supplementsData: any[]) => {
  if (!supplementsData || supplementsData.length === 0) return '';
  return `
    <table>
      <thead>
        <tr>
          <th>Supplement</th>
          <th>Form</th>
          <th>Dosage</th>
          <th>Timing</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        ${supplementsData.map((supp: any) => `
          <tr>
            <td>${supp.name}</td>
            <td>${supp.form}</td>
            <td>${supp.dosage}</td>
            <td>${supp.timing}</td>
            <td>${supp.reason}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

export const generateThreeMonthPlanTable = (planData: any[]) => {
  if (!planData || planData.length === 0) return '';
  return `
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Nutrition</th>
          <th>Lifestyle</th>
          <th>Supplements</th>
          <th>Exercise</th>
          <th>Tests</th>
          <th>Expected Outcomes</th>
        </tr>
      </thead>
      <tbody>
        ${planData.map((month: any) => `
          <tr>
            <td>${month.month}</td>
            <td>${month.nutrition}</td>
            <td>${month.lifestyle}</td>
            <td>${month.supplements}</td>
            <td>${month.exercise}</td>
            <td>${month.tests}</td>
            <td>${month.expectedOutcomes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};
