import { Routes, Route } from "react-router-dom";

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
} from "@/_root/pages";
import  Messenger  from "@/_root/pages/Messenger";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
// import './_root/pages/chat/sass/layout/grid';
// import './_root/pages/chat/sass/base/reset';
// import './_root/pages/chat/sass/components/register';
// import './_root/pages/chat/sass/utils/utils';
// import './_root/pages/chat/sass/components/messenger';
// import './_root/pages/chat/sass/components/activeFriend';
// import './_root/pages/chat/sass/components/friends';
// import './_root/pages/chat/sass/components/rightSide';
// import './_root/pages/chat/sass/components/message';
// import './_root/pages/chat/sass/components/messageSend';
// import './_root/pages/chat/sass/components/friendInfo';
import './_root/pages/chat/sass/layout/_grid.css';
import './_root/pages/chat/sass/base/_reset.css';
import './_root/pages/chat/sass/components/_register.css';
import './_root/pages/chat/sass/utils/_utils.css';
import './_root/pages/chat/sass/components/_messenger.css';
import './_root/pages/chat/sass/components/_activeFriend.css';
import './_root/pages/chat/sass/components/_friends.css';
import './_root/pages/chat/sass/components/_rightSide.css';
import './_root/pages/chat/sass/components/_message.css';
import './_root/pages/chat/sass/components/_messageSend.css';
import './_root/pages/chat/sass/components/_friendInfo.css';

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/message" element={<Messenger />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
