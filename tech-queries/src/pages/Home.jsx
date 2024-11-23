import { useState, useEffect } from "react";
import { Bell, Search, HelpCircle, Library, BarChart } from "lucide-react";

const Home = () => {
  const [currentView, setCurrentView] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Your question was answered", time: "5m ago" },
    { id: 2, message: "New tech report available", time: "1h ago" },
  ]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const reports = [
    {
      id: 1,
      title: "Daily Tech Report",
      description: "Performance metrics and updates",
    },
    {
      id: 2,
      title: "Weekly Summary",
      description: "Team productivity and milestones",
    },
    {
      id: 3,
      title: "Monthly Overview",
      description: "Project status and roadmap",
    },
  ];

  const userAvatar = "/api/placeholder/32/32";

  useEffect(() => {
    fetchQuestions();
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", `user-${Date.now()}`);
    }
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer YviS2YMWU0YYwYYeMtQln89QlU53",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId") || `user-${Date.now()}`,
            appSlug: "marmeto-tech-hub",
            action: "read",
            table: "questions",
          }),
        }
      );

      const result = await response.json();
      if (!result.error && Array.isArray(result.data)) {
        setQuestions(result.data.map((item) => item.data));
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const submitQuestion = async () => {
    if (!newQuestion.title || !newQuestion.description) {
      return;
    }

    try {
      const response = await fetch(
        "https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer YviS2YMWU0YYwYYeMtQln89QlU53",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId") || `user-${Date.now()}`,
            appSlug: "marmeto-tech-hub",
            action: "create",
            table: "questions",
            data: {
              title: newQuestion.title,
              description: newQuestion.description,
              tags: newQuestion.tags.split(",").map((t) => t.trim()).filter(Boolean),
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      const result = await response.json();
      if (!result.error) {
        setQuestions((prev) => [result.data[0].data, ...prev]);
        setNewQuestion({ title: "", description: "", tags: "" });
        setCurrentView("browse");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                Marmeto Tech Hub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                    <h3 className="font-semibold mb-4">Notifications</h3>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="py-2 border-b last:border-b-0"
                      >
                        <p className="text-sm">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <img
                src={userAvatar}
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queries..."
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setCurrentView("ask")}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
            Ask Question
          </button>
          <button
            onClick={() => setCurrentView("browse")}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Library className="h-6 w-6 text-green-600 mr-2" />
            Browse Questions
          </button>
          <button
            onClick={() => setCurrentView("reports")}
            className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart className="h-6 w-6 text-purple-600 mr-2" />
            Tech Reports
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentView === "ask" && (
            <div className="space-y-4">
              <h2 className="text-xl text-left font-semibold mb-4">Ask a Question</h2>
              <div>
                <label className=" text-left font-bold block mb-2">Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                  placeholder="Enter question title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className=" text-left font-bold  block mb-2">Description</label>
                <textarea
                  value={newQuestion.description}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your question"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className=" text-left font-bold  block mb-2">Tags</label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, tags: e.target.value })
                  }
                  placeholder="Separate tags with commas"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={submitQuestion}
                disabled={!newQuestion.title || !newQuestion.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Question
              </button>
            </div>
          )}

          {currentView === "browse" && (
            <div className="space-y-4">
              <h2 className=" text-left font-bold  text-xl font-semibold mb-4">Recent Questions</h2>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold">{question.title}</h3>
                    <p className="text-gray-600 mt-2">{question.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No questions found</p>
              )}
            </div>
          )}

          {currentView === "reports" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Tech Reports</h2>
              <div className=" text-left font-bold  grid grid-cols-1 md:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-gray-600 mt-2">{report.description}</p>
                    <button className="text-blue-600 hover:underline mt-2">
                      Download Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;