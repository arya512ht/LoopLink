import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import { userRegister } from "@/_root/pages/chat/store/actions/authAction";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser:any = await createUserAccount(user);

      console.log(newUser)

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });

        return;
      }

      const data = {
        "userName": user.username,
        "password": user.password,
        "email": user.email,
        "image": newUser.imageUrl,
        "id": newUser.$id
      }


      await signInAccount({
        email: user.email,
        password: user.password,
      }).then(()=>dispatch(userRegister(data))).catch(()=>{toast({ title: "Something went wrong. Please login your new account", });

      navigate("/sign-in");});

      // if (!session) {
      //   toast({ title: "Something went wrong. Please login your new account", });

      //   navigate("/sign-in");

      //   return;
      // }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        const data = {
          "userName": user.username,
          "password": user.password,
          "email": user.email,
          "image": newUser.imageUrl,
          "id": newUser.$id
        }

        // console.log(user)

        // const response = await axios.post('https://looplink-chat-backend.onrender.com/api/messenger/user-register', data, config);
        // localStorage.setItem('authToken', response.data.token);

        // dispatch({
        //   type: REGISTER_SUCCESS,
        //   payload: {
        //     successMessage: response.data.successMessage,
        //     token: response.data.token
        //   }
        // })

        dispatch(userRegister(data));  

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again.", });

        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col mt-5 pb-2">

        <h2 className="h3-bold md:h2-bold pt-3 sm:pt-3">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use LoopLink, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-1">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
