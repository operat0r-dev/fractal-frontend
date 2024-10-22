import { useToast } from '@/hooks/use-toast';
import {
  ValidationError,
  AccessForbiddenError,
} from '@/modules/core/errors/errors';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useHandleError = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleError = <TFieldValues extends FieldValues>(
    error: unknown,
    options?: {
      formErrorHandler?: UseFormSetError<TFieldValues>;
      shouldNavigateBack?: boolean;
    }
  ) => {
    if (error instanceof ValidationError) {
      if (options) {
        const { formErrorHandler } = options;
        const { invalidFields } = error;

        if (formErrorHandler && invalidFields) {
          Object.keys(invalidFields).forEach((key) => {
            if (invalidFields[key]) {
              formErrorHandler(key as Path<TFieldValues>, {
                message: invalidFields[key][0],
              });
            }
          });
        }
      }

      console.error(error);
      toast({
        variant: 'destructive',
        description: t(`general.` + error.message),
      });
    } else if (error instanceof AccessForbiddenError) {
      navigate(-1);
    }
  };

  return {
    handleError,
  };
};
