import React from "react";
import customer from "@/assets/people.png";
import vendor from "@/assets/vendor.png";

const RoleSlectionCard = ({
  role,
  roleOptions,
  handleRoleSelection,
  isLoading,
}) => {
  return (
    <div
      className={`
        border-white border-2 w-full lg:w-72 relative rounded-xl p-5 text-left
        transition-all duration-200
        ${
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-white/10"
        }
      `}
      onClick={() => {
        if (!isLoading) {
          handleRoleSelection(role.toLowerCase());
        }
      }}
    >
      <img
        src={role === "Customer" ? customer : vendor}
        alt={role}
        className="h-12 w-12 mb-4"
      />

      <h2 className="font-sans text-2xl mb-2 font-semibold">{role}</h2>

      <p className="section-eyebrow mb-2">What you can do :</p>

      <ol className="list-disc ml-4 space-y-1">
        {roleOptions.map((roleOption, index) => (
          <li className="mb-1 text-lg" key={index}>
            {roleOption}
          </li>
        ))}
      </ol>

      {isLoading && (
        <p className="mt-4 text-sm text-yellow-400">Please wait...</p>
      )}
    </div>
  );
};

export default RoleSlectionCard;
