import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMessages(conversationId?: number) {
  return useQuery({
    queryKey: [api.messages.list.path, conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const url = buildUrl(api.messages.list.path, { id: conversationId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!conversationId,
  });
}

export function useChatCompletion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { message: string; conversationId?: number }) => {
      const res = await fetch(api.chat.completions.path, {
        method: api.chat.completions.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to get response");
      }
      
      return api.chat.completions.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate the message list for the specific conversation
      queryClient.invalidateQueries({ 
        queryKey: [api.messages.list.path, data.conversationId] 
      });
      // Also invalidate conversations list in case a new one was created (title might change later)
      queryClient.invalidateQueries({ 
        queryKey: [api.conversations.list.path] 
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
