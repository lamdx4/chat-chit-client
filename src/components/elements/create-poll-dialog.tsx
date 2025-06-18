import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
}

interface CreatePollProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  poll: Poll;
  onClose: () => void;
  setPoll: (poll: Poll) => void;
  onCreatePoll?: (poll: Poll) => void; // Callback để handle create poll
}

const CreatePollDialog = ({
  isOpen,
  setIsOpen,
  poll,
  setPoll,
  onClose,
  onCreatePoll,
}: CreatePollProps) => {
  const addOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      text: "",
    };
    setPoll({
      question: poll.question || "",
      options: [...poll.options, newOption],
    });
  };

  const removeOption = (id: string) => {
    if (poll.options.length > 2) {
      setPoll({
        question: poll.question,
        options: poll.options.filter((option) => option.id !== id),
      });
    }
  };

  const updateOption = (id: string, text: string) => {
    setPoll({
      question: poll.question,
      options: poll.options.map((option) =>
        option.id === id ? { ...option, text } : option
      ),
    });
  };

  const updateQuestion = (question: string) => {
    setPoll({
      question,
      options: poll.options,
    });
  };

  const handleCreatePoll = () => {
    const validOptions = poll.options.filter((option) => option.text.trim() !== "");

    if (poll.question.trim() === "" || validOptions.length < 2) {
      alert("Please enter a question and at least 2 options");
      return;
    }

    const finalPoll: Poll = {
      question: poll.question.trim(),
      options: validOptions,
    };

    // Handle create poll logic here
    console.log("Creating poll:", finalPoll);
    
    // Call parent callback if provided
    onCreatePoll?.(finalPoll);

    // Reset form
    setPoll({
      question: "",
      options: [
        { id: "1", text: "" },
        { id: "2", text: "" },
      ],
    });
    
    setIsOpen(false);
    onClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Ask a question section */}
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-700 text-center">
              Ask a question
            </h3>
            
            <Textarea
              placeholder="What would you like to ask?"
              value={poll.question}
              onChange={(e) => updateQuestion(e.target.value)}
              className="min-h-[80px] text-base border-gray-200 resize-none"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Options section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-600">
                Add option...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={addOption}
                className=" hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>

                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="flex-1 border-gray-200 "
                  />

                  {poll.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Create Poll Button */}
          <div className="pt-4">
            <Button
              onClick={handleCreatePoll}
              disabled={
                poll.question.trim() === "" || 
                poll.options.filter(o => o.text.trim() !== "").length < 2
              }
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium py-3 text-lg rounded-lg"
              size="lg"
            >
              Create Poll
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollDialog;