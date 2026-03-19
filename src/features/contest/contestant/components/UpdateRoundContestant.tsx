import { Button } from "@mui/material";
import { useForm } from "react-hook-form";


import AppFormDialog from "../../../../components/AppFormDialog"
import FormSelect from "../../../../components/FormSelect"

interface UpdateRoundContestantProps {
    ids: number[] | [];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    rounds: []
}
type RoundValue = {
    roundId: number;
}
export default function UpdateRoundContestant({
    ids,
    isOpen,
    onClose,
    onSubmit,
    rounds,
}: UpdateRoundContestantProps): React.ReactElement {
    const { control, handleSubmit, formState: { errors } } = useForm<RoundValue>();
    const roundOptions = (rounds ?? []).map((r: any) => ({
        label: r.name,
        value: r.id,
    }));

    const handleFormSubmit = (formData: RoundValue) => {
        onSubmit(formData);
        onClose();
    };
    return (
        <AppFormDialog
            open={isOpen}
            onClose={onClose}
            title={`Cập nhật (${ids.length})thí sinh qua vòng `}
            maxWidth="sm"
        >
            <form id="create-class-form" onSubmit={handleSubmit(handleFormSubmit)}>
                <FormSelect
                    id="roundId"
                    name="roundId"
                    label="Tên vòng đấu"
                    options={roundOptions}
                    control={control}
                    error={errors.roundId}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, display: "block ", float: "right", marginTop: "24px" }}
                >
                    Cập nhật
                </Button>
            </form>
        </AppFormDialog>
    )
}