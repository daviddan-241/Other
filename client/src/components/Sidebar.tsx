import { Link, useLocation } from "wouter";
import { useConversations } from "@/hooks/use-conversations";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, LogOut, MessageSquare, Terminal, User, X } from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { conversations, createConversation, deleteConversation } = useConversations();
  const { user, logout } = useAuth();

  const handleNewChat = () => {
    createConversation("New Session", {
      onSuccess: (data) => {
        setLocation(`/chat/${data.id}`);
        onClose?.();
      }
    });
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-black border-r border-primary/20 w-[280px] flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-black flex items-center justify-center font-bold text-xl">
              H
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-wider text-primary leading-none">HACX_GPT</h1>
              <span className="text-[10px] text-primary/50 tracking-[0.2em]">UNRESTRICTED_AI</span>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary/50 hover:text-primary hover:bg-primary/10 h-8 w-8 md:hidden"
              data-testid="button-close-sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/30 transition-all font-mono tracking-wide"
          data-testid="button-new-session"
        >
          <Plus className="w-4 h-4" /> NEW_SESSION
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {sortedConversations.length === 0 ? (
            <div className="text-center py-10 opacity-30 text-xs uppercase tracking-widest">
              No active sessions found in memory.
            </div>
          ) : (
            sortedConversations.map((chat) => (
              <div
                key={chat.id}
                className="group flex items-center gap-2 pr-2"
                data-testid={`row-conversation-${chat.id}`}
              >
                <Link
                  href={`/chat/${chat.id}`}
                  onClick={() => onClose?.()}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-3 text-sm transition-colors border border-transparent truncate",
                    location === `/chat/${chat.id}`
                      ? "bg-primary/10 border-primary/30 text-primary font-bold"
                      : "text-primary/60 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                  <div className="flex flex-col truncate text-left">
                    <span className="truncate">{chat.title}</span>
                    <span className="text-[9px] opacity-50 font-normal">
                      {chat.updatedAt ? format(new Date(chat.updatedAt), 'MMM dd HH:mm') : ''}
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(chat.id);
                    if (location === `/chat/${chat.id}`) setLocation('/');
                  }}
                  data-testid={`button-delete-conversation-${chat.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-primary/20 bg-black/50 space-y-2">
        <SettingsModal />

        <div className="pt-2 border-t border-primary/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full rounded-full opacity-80" />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-primary truncate" data-testid="text-username">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Unknown User'}
              </span>
              <span className="text-[9px] text-primary/50 truncate font-mono">
                ID: {user?.id?.slice(0, 8)}...
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs uppercase tracking-widest"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="w-3 h-3" /> Terminate_Session
          </Button>
        </div>
      </div>
    </div>
  );
}
