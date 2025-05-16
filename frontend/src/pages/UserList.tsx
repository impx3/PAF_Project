import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatDialog } from "@/components/chat/chat.tsx";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  totalLikes: number;
  firstName: string;
  lastName: string;
  profileImage: string;
}

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);

  const handleMessageClick = (user: PublicUser) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  useEffect(() => {
    // Check currentUser is being properly loaded

    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        // Log the full response to check the structure of the data
        console.log("Fetched users:", res.data.result);

        // Filter out the current user
        const otherUsers = res.data.result?.filter(
          (u: PublicUser) => u.id !== currentUser?.id,
        );

        setUsers(otherUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    // Ensure that currentUser is available before fetching users
    if (currentUser) {
      fetchUsers();
    } else {
      console.error("currentUser is null or undefined, not fetching users");
    }
  }, [currentUser]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Connect with Culinary Creators
        </h2>
        <p className="text-muted-foreground">
          Discover and follow fellow food enthusiasts
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users to follow</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card
              key={user.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.profileImage || "/default-avatar.png"}
                      alt={`${user.username}'s profile`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    <p className="text-sm mt-1">
                      🎖️ {user.totalLikes.toLocaleString()} Likes
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <FollowButton targetId={user.id.toString()} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMessageClick(user)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipient={selectedUser as PublicUser}
      />
    </div>
  );
};

export default UserList;
