import React, { useLayoutEffect, useState } from "react";
import { TreeSelect } from "antd";
import * as API from "src/api/request";
import { useUserContext } from "src/contexts/userContext";
import _ from "lodash";

const Departmenttree = (props) => {
  const { user } = useUserContext();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    API.getUserDepartment().then((res) => {
      var result = [];
      _.map(_.orderBy(res, ["departmentlevelid", "departmentcode"]), (item) => {
        result.push({
          ...item,
          title: item.departmentcode + " | " + item.departmentname,
          key: item.id,
          value: item.id,
          id: item.id,
          pId: item.parentid,
          selectable: item.departmentlevelid !== -1,
        });
      });
      setList(result);

      if (result?.length > 0 && !props.value) {
        console.log("check check");
        var department = _.find(result, {
          departmentcode: user?.info?.tseh_code,
        });
        props.onChange(department.id);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <TreeSelect
      showSearch
      allowClear={true}
      placeholder="Сонгоно уу"
      treeDataSimpleMode={true}
      className="w-full md:max-w-[400px]"
      treeData={list}
      treeLine={(true, { showLeafIcon: false })}
      {...props}
      // filterTreeNode={(search, item) =>
      //   item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
      // }
      open={open}
      onDropdownVisibleChange={(open) => {
        setOpen(open);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          var department = _.find(list, {
            departmentcode: e.target.value,
          });
          if (department) {
            props.onChange(department.id);
            setOpen(false);
          }
        }
      }}
    />
  );
};

export default React.memo(Departmenttree);
