import { Box, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../Components/CartProductCard/Loading";
import { GET_USER } from "../../Redux/AdminReducer/AdminAction";
import { GetLocal } from "../../Utils/localstorage";
import styles from "./Admin.module.css";
import swal from "sweetalert";

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}
export default function User() {
  const [user, setUser] = useState([]);
  const [render, setrender] = useState(true);

  const { users, user_auth, isloading } = useSelector(
    (store) => store.AdminReducer
  );
  const Token = GetLocal("auth");
  const dispatch = useDispatch();
  const getALlUser = async () => {
    dispatch(GET_USER(Token)).then((res) => {
      setrender(false);
      setUser(users);
    });
  };
  console.log(user);
  // const get_quantity = async () => {
  //   await axios
  //     .get("http://localhost:5000/users/count", {
  //       headers: {
  //         token: `Bearer ${Token}`,
  //       },
  //     })
  //     .then((res) => setTotalUser(res.data))
  //     .catch((err) => window.alert("Something Went wrong"));
  // };

  const handleDelete = async (id) => {
    setrender(false);
    await axios
      .delete(`http://localhost:5000/users/${id}`, {
        headers: {
          token: `Bearer ${Token}`,
        },
      })
      .then((res) => {
        setrender(true);
        swal({
          title: res.data,
          text: "",
          icon: "success",
          button: "ok",
        });
      })
      .catch((err) => {
        swal({
          title: "User Delete Failed",
          text: "Please Try again",
          icon: "error",
          button: "ok",
        });
        setrender(true);
      });
  };

  useEffect(() => {
    getALlUser();
  }, [user_auth, render]);

  return (
    <div>
      <div className={styles.userContainer}>
        {isloading ? (
          <Loading />
        ) : (
          <>
            {user.map((singleUser) => (
              <div className={styles.single}>
                <Box
                  bgColor="blue.100"
                  p="10px"
                  textAlign="center"
                  borderRadius="5px"
                  key={singleUser._id}
                  boxShadow="rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                >
                  <Text fontSize={["8px", "8px", "14px", "14px"]} mt="8px">
                    First Name: {singleUser.firstName}
                  </Text>
                  <Text fontSize={["8px", "8px", "14px", "14px"]} mt="8px">
                    Last Name: {singleUser.lastName}
                  </Text>
                  <Text fontSize={["8px", "8px", "14px", "14px"]} mt="8px">
                    Email: {singleUser.email}
                  </Text>
                  <Text fontSize={["8px", "8px", "14px", "14px"]} mt="8px">
                    Admin Access: {singleUser.isAdmin ? "YES" : "NO"}
                  </Text>
                  <Button
                    size="sm"
                    mt="8px"
                    colorScheme="red"
                    onClick={() => handleDelete(singleUser._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </div>
            ))}
          </>
        )}
      </div>
      {/* <div className={styles.pagination}>
        <Paginations
          getALlUser={getALlUser}
          styles={styles}
          totalUser={totalUser}
        />
      </div> */}
    </div>
  );
}
