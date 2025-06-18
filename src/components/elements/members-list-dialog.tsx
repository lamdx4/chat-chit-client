/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  Crown,
  Users,
} from "lucide-react";
import { type Member, MemberStatusType } from "@/types/member.model";

interface MembersListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  currentUserId: number;
  groupName: string;
  onViewProfile: (username: string) => void;
  onSendMessage: (userId: number) => void;
  onChangeRole: (memberId: number, roleId: number) => void;
  onPromoteToAdmin: (memberId: number) => void;
  onRemoveMember: (memberId: number) => void;
  onBanMember: (memberId: number) => void;
  onUnbanMember: (memberId: number) => void;
  onInviteMembers: () => void;
  availableRoles?: Array<{
    roleId: number;
    name: string;
    permission: string[];
  }>;
}

// Member status badge component
const MemberStatusBadge = ({ status }: { status: MemberStatusType }) => {
  const getStatusConfig = (status: MemberStatusType) => {
    switch (status) {
      case MemberStatusType.Active:
        return { color: "bg-green-100 text-green-800", label: "Active" };
      case MemberStatusType.Invited:
        return { color: "bg-yellow-100 text-yellow-800", label: "Invited" };
      case MemberStatusType.AdminApprovalPending:
        return { color: "bg-orange-100 text-orange-800", label: "Pending" };
      case MemberStatusType.Left:
        return { color: "bg-gray-100 text-gray-800", label: "Left" };
      case MemberStatusType.Banned:
        return { color: "bg-red-100 text-red-800", label: "Banned" };
      default:
        return { color: "bg-gray-100 text-gray-800", label: "Unknown" };
    }
  };

  const config = getStatusConfig(status);
  return (
    <Badge variant="secondary" className={`${config.color} text-xs`}>
      {config.label}
    </Badge>
  );
};

// Member role badge component
const MemberRoleBadge = ({ role }: { role?: { name: string } }) => {
  if (!role) return null;

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes("Owner")) {
      return <Crown className="h-3 w-3" />;
    }
    if (name.includes("Admin")) {
      return <ShieldCheck className="h-3 w-3" />;
    }
    return <Shield className="h-3 w-3" />;
  };

  const getRoleColor = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name.includes("Owner")) return "bg-purple-100 text-purple-800";
    if (name.includes("Admin")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Badge
      variant="secondary"
      className={`${getRoleColor(role.name)} text-xs flex items-center gap-1`}
    >
      {getRoleIcon(role.name)}
      {role.name}
    </Badge>
  );
};

// Member actions dropdown component

// Main component
export default function MembersListDialog({
  isOpen,
  onClose,
  members,
  currentUserId,
  groupName,
  onInviteMembers,
}: MembersListDialogProps) {
  const [searchQuery] = useState("");
  const [statusFilter] = useState<string>("all");
  const [roleFilter] = useState<string>("all");

  // Filter and search members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search filter
      const matchesSearch =
        member.user.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.user.userName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.nickName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;

      // Role filter
      const matchesRole =
        roleFilter === "all" || member.role?.name === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [members, searchQuery, statusFilter, roleFilter]);

  // Get unique roles for filter
  // const uniqueRoles = useMemo(() => {
  //   const roles = members
  //     .map((member) => member.role?.name)
  //     .filter((role): role is string => !!role)
  //     .filter((role, index, array) => array.indexOf(role) === index);
  //   return roles;
  // }, [members]);

  // Format join date
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Get member stats
  const memberStats = useMemo(() => {
    const stats = {
      total: members.length,
      active: members.filter((m) => m.status === MemberStatusType.Active)
        .length,
      pending: members.filter(
        (m) => m.status === MemberStatusType.AdminApprovalPending
      ).length,
      invited: members.filter((m) => m.status === MemberStatusType.Invited)
        .length,
      banned: members.filter((m) => m.status === MemberStatusType.Banned)
        .length,
    };
    return stats;
  }, [members]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {groupName} Members ({memberStats.total})
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {memberStats.active} Active
          </Badge>
          {memberStats.pending > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              {memberStats.pending} Pending
            </Badge>
          )}
          {memberStats.invited > 0 && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              {memberStats.invited} Invited
            </Badge>
          )}
          {memberStats.banned > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {memberStats.banned} Banned
            </Badge>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div> */}
          {/* 
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={MemberStatusType.Active}>Active</SelectItem>
              <SelectItem value={MemberStatusType.Invited}>Invited</SelectItem>
              <SelectItem value={MemberStatusType.AdminApprovalPending}>Pending</SelectItem>
              <SelectItem value={MemberStatusType.Banned}>Banned</SelectItem>
              <SelectItem value={MemberStatusType.Left}>Left</SelectItem>
            </SelectContent>
          </Select> */}

          {/* {uniqueRoles.length > 0 && (
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[120px]">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} */}

          <Button onClick={onInviteMembers} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>

        {/* Members List */}
        <div className="flex-1 pr-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No members found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.memberId}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={member.user.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>{member.user.fullName[0]}</AvatarFallback>
                  </Avatar>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {member.nickName || member.user.fullName}
                      </h4>
                      {member.userId === currentUserId && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <MemberStatusBadge status={member.status} />
                      <MemberRoleBadge role={member.role} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>@{member.user.userName}</span>
                      <span>Joined {formatJoinDate(member.timeJoin)}</span>
                      {member.user.country && (
                        <span>{member.user.country}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {/* <MemberActionsDropdown
                    member={member}
                    currentUserId={currentUserId}
                    onViewProfile={onViewProfile}
                    onSendMessage={onSendMessage}
                    onChangeRole={onChangeRole}
                    onPromoteToAdmin={onPromoteToAdmin}
                    onRemoveMember={onRemoveMember}
                    onBanMember={onBanMember}
                    onUnbanMember={onUnbanMember}
                    availableRoles={availableRoles}
                  /> */}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
