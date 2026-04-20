import { DUMMYJSON_TODOS_URL } from '@product-portal/constants';

interface DummyTodo {
  id: number;
  todo: string;
  completed: boolean;
}

interface TodosResponse {
  todos: DummyTodo[];
}

export async function LiveTodos() {
  // No 'use cache' — fully dynamic, fetched fresh on every request
  const res = await fetch(DUMMYJSON_TODOS_URL, { cache: 'no-store' });
  const data: TodosResponse = await res.json();

  console.log(`[PPR] LiveTodos fetched at ${new Date().toISOString()} — dynamic (no cache)`);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Live Todos</h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          dynamic: streaming
        </span>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        {data.todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-3 px-4 py-2.5">
            <span
              className={`flex items-center justify-center w-5 h-5 rounded border text-xs ${
                todo.completed
                  ? 'bg-green-50 border-green-300 text-green-600'
                  : 'bg-gray-50 border-gray-300 text-gray-400'
              }`}
            >
              {todo.completed ? '✓' : ''}
            </span>
            <span
              className={`text-sm ${
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              {todo.todo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
