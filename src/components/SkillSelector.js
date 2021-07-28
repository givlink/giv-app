const groupByCategory = (allSkills = []) => {
  const result = {};
  Object.values(allSkills).forEach((s) => {
    let key = s.category || "others";
    const theList = result[key] || [];
    theList.push(s);
    result[key] = theList;
  });

  return result;
};

const SkillSelector = ({ userSkills = {}, skillCategories, allSkills = {}, handleClick }) => {
  const isSelected = (skillId) => userSkills[skillId];

  const categoryMap = {
    others: { tag: "Others" },
  };
  skillCategories.forEach((c) => (categoryMap[c.id] = c));

  const byCat = groupByCategory(allSkills);
  return Object.entries(byCat).map(([catId, skills]) => {
    return (
      <div key={catId} className="text-left pl-3 font-medium text-gray-600 mb-6">
        <h4 className="mb-2">{categoryMap[catId].tagEn}</h4>
        <ul className="inline-flex flex-wrap -m-0.5">
          {Object.values(skills).map((s) => {
            const selected = isSelected(s.id);
            return (
              <button
                key={s.id}
                className={`${
                  selected
                    ? "bg-giv-blue text-white border-giv-blue-dark"
                    : "text-gray-900 border-gray-300"
                } m-0.5 rounded-full leading-none text-white border text-xs px-3 py-2 text-center`}
                onClick={() => handleClick(s.id, !selected)}
              >
                {s.tag}
              </button>
            );
          })}
        </ul>
      </div>
    );
  });
};

export default SkillSelector;
