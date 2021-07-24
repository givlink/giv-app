const SkillSelector = ({ userSkills = {}, allSkills = {}, handleClick }) => {
  const isSelected = (skillId) => userSkills[skillId];
  return (
    <ul className="inline-flex flex-wrap -m-0.5">
      {Object.values(allSkills).map((s) => {
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
  );
};

export default SkillSelector;
