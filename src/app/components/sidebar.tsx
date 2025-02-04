"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ChevronDown, ChevronRight,  Plus,  Edit2, Trash2, ChartLine } from 'lucide-react';
import Popup from "./Popup";

// Define a type for the menu names
// type MenuName = 'dataAnalysis' | 'rag' | null;


// Define interfaces for our data structures
interface Board {
  name: string;
  is_active: boolean;
  path?: string; // Added path for dynamic routing
}

interface MainBoard {
  main_board_id: string;
  name: string;
  
  boards: {
    [key: string]: Board;
  };
}

// Update the SelectedBoard type to match exactly what we're using
type SelectedBoard = {
  mainBoardId: string;
  boardId?: string;
  boardName?: string;
  
} | null;  // Allow null as a possible value

const Sidebar = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // Update the state definition to use the SelectedBoard type
  const [selectedBoard, setSelectedBoard] = useState<SelectedBoard>(null);
  const [navItems, setNavItems] = useState<MainBoard[]>([]);
  const [activeMainBoard, setActiveMainBoard] = useState<string | null>(null);
  // const [openMainBoards, setOpenMainBoards] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();




    // New function to generate dynamic page
    const generateDynamicPage = async (mainBoardId: string, boardId: string, boardName: string) => {
      try {
        const response = await fetch('https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mainBoardId,
            boardId,
            boardName
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to create dynamic page');
        }
  
        const pageData = await response.json();
        
        // Update local state with new page path
        setNavItems(prevItems => 
          prevItems.map(item => 
            item.main_board_id === mainBoardId 
              ? { 
                  ...item, 
                  boards: {
                    ...item.boards,
                    [boardId]: { 
                      ...item.boards[boardId],
                      path: pageData.path 
                    }
                  }
                }
              : item
          )
        );
  
        return pageData.path;
      } catch (error) {
        console.error('Error creating dynamic page:', error);
        return null;
      }
    };

    const handleCreateBoard = async (boardData: {
      mainBoardId: string, 
      boardName: string
    }) => {
      try {
        const response = await fetch('https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(boardData)
        });
  
       // Enhanced error handling
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Server error:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
        const newBoard = await response.json();
        // return newBoard;
        
        // Generate dynamic page
        const pagePath = await generateDynamicPage(
          boardData.mainBoardId, 
          newBoard.boardId, 
          boardData.boardName
        );
  
        // Update navigation items
        setNavItems(prevItems => 
          prevItems.map(item => 
            item.main_board_id === boardData.mainBoardId 
              ? { 
                  ...item, 
                  boards: {
                    ...item.boards,
                    [newBoard.boardId]: { 
                      name: boardData.boardName, 
                      is_active: true,
                      path: pagePath
                    }
                  }
                }
              : item
          )
        );
  
        closeModal();
        
        // Optionally navigate to the new page
        if (pagePath) {
          router.push('/Dashboard');
        }
      } catch (error) {
        console.error('Board creation error:', error);
      }
    };
  
  const handlePlusClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>, 
    mainBoardId: string) => {
    event.stopPropagation();
    // Now TypeScript knows this is a valid SelectedBoard type
    setSelectedBoard({ mainBoardId });
    setShowModal(true);
  };


  const handleEditClick = (boardId: string, mainBoardId: string) => {
    const boardData = navItems
      .find(item => item.main_board_id === mainBoardId)
      ?.boards[boardId];

    if (boardData) {
      setSelectedBoard({
        mainBoardId,
        boardId,
        boardName: boardData.name,
      });
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBoard(null);  // This is now properly typed
  };

  // Rest of your component code remains the same...
  const handleDelete = async (boardId: string, mainBoardId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this board?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete board:', errorData);
        return;
      }

      setNavItems((prevNavItems) => {
        return prevNavItems.map((item) => {
          if (item.main_board_id === mainBoardId) {
            const updatedBoards = Object.keys(item.boards)
              .filter((key) => key !== boardId && item.boards[key].is_active)
              .reduce((acc, key) => {
                acc[key] = item.boards[key];
                return acc;
              }, {} as { [key: string]: Board });

            return { ...item, boards: updatedBoards };
          }
          return item;
        });
      });
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };


  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await fetch(`https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/get_all_info_tree`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data: MainBoard[] = await response.json();
          setNavItems(data);
        } else {
          console.error('Failed to fetch navigation data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavItems();
  }, []);

  const toggleMainBoard = (mainBoardId: string) => {
    setActiveMainBoard(prevState => prevState === mainBoardId ? null : mainBoardId);
  };

  const handleLogout = () => {
    router.push('/');
  };
  return (
    <div className="h-screen w-84 bg-teal-900 text-white flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">GBUSINESS.AI</h1>
      </div>



      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          <div className="mb-4">

            <div className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <Link href="/Dashboard" passHref>
                <span className="extramenu text-white">Dashboard</span>
              </Link>
            </div>
            {navItems.map((item) => (
              <div key={item.main_board_id} className="mb-4">
                <div
                  className="flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer"
                  onClick={() => toggleMainBoard(item.main_board_id)}
                >
                  <div className="flex items-center">
                    {activeMainBoard === item.main_board_id ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <Plus
                    className="w-4 h-4 hover:text-blue-400"
                    onClick={(e) => handlePlusClick(e, item.main_board_id)}
                  />
                </div>

                {activeMainBoard === item.main_board_id && (
                  <div className="ml-6 mt-2 space-y-2">
                    {Object.keys(item.boards)
                      .filter(boardId => item.boards[boardId].is_active)
                      .map((boardId) => (
                        <div
                          key={boardId}
                          className="flex items-center justify-between p-2 hover:bg-gray-800 rounded"
                        >

                          {/* Board Link */}
                          <Link
                      href={{
                        pathname: '/Container',
                        query: { main_board_id: item.main_board_id, board_id: boardId },
                      }}
                      className="dropdown-link text-white"
                    >
                      {item.boards[boardId].name}
                    </Link>
                          <div className="flex space-x-2">
                            <Edit2
                              className="w-4 h-4 hover:text-blue-400 cursor-pointer"
                              onClick={() => handleEditClick(boardId, item.main_board_id)}
                            />
                            <Trash2
                              className="w-4 h-4 hover:text-red-400 cursor-pointer"
                              onClick={() => handleDelete(boardId, item.main_board_id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer">
              <ChartLine className="w-4 h-4 mr-2" />
              <a href="/docs-review" className="extramenu text-white">Docs Review</a>
            </div>
          </div>
        </div>

      </div>



      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-gray-400 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedBoard?.boardId ? 'Edit Board' : 'New Board'}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {/* Add your modal content here */}
            {showModal && selectedBoard && (
              <div className="modal-overlay" onClick={closeModal}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="modal-close-btn"
                    onClick={closeModal}
                  >
                    ×
                  </button>
                  <Popup
                    mainBoardId={selectedBoard.mainBoardId}
                    boardId={selectedBoard.boardId || null}
                    boardName={selectedBoard.boardName || ''}
                    onSubmit={handleCreateBoard}
                    closeModal={closeModal}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>




  )
};

export default Sidebar;



