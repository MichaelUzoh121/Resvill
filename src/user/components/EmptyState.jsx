    import { Bell } from "lucide-react";


    function EmptyState({ text }) {

    return (
        <div className="rounded-xl bg-dark-50 px-5 py-10 text-center">

        <Bell
            className="mx-auto text-dark-400"
            size={24}
        />

        <p className="mt-3 text-sm text-dark-600">
            {text}
        </p>

        </div>
    );
    }


    export default EmptyState;