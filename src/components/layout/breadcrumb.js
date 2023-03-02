import React from "react";
import { useUserContext } from "src/contexts/userContext";

const Breadcrumb = () => {
  const { user } = useUserContext();
  return (
    <div className="breadcrumb-header justify-content-between">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {user.current.menuName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default React.memo(Breadcrumb);
